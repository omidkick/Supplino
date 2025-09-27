const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  addNewCommentSchema,
  editCommentTextSchema,
} = require("../../validators/comment/comment.schema");
const { copyObject } = require("../../../../utils/functions");
const { CommentModel } = require("../../../models/comment");
const { ProductModel } = require("../../../models/product");
const Controller = require("../controller");

const ObjectId = mongoose.Types.ObjectId;

class CommentController extends Controller {
  async addNewComment(req, res) {
    const user = req.user;
    const status = user.role === "ADMIN" ? 2 : 2;
    const { text, parentId, productId, parentAnswerId } = req.body;

    try {
      await addNewCommentSchema.validateAsync(req.body);

      // Check if product exists
      const product = await ProductModel.findById(productId);
      if (!product) throw createHttpError.NotFound("محصول یافت نشد");

      // Prepare new comment/answer data
      const newCommentData = {
        content: { text },
        product: productId,
        user: user._id,
        status,
        openToComment: false,
        parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        // Set parentAnswerId only if it exists
        parentAnswerId: parentAnswerId
          ? new mongoose.Types.ObjectId(parentAnswerId)
          : null,
        createdAt: new Date(),
      };

      // If this is a reply to a comment or answer
      if (parentId) {
        // Find parent (could be a comment or an answer)
        const parent = await this.findCommentOrAnswer(parentId, parentAnswerId);

        // Check if parent allows replies
        if (!parent.openToComment) {
          throw createHttpError.BadRequest("پاسخ دادن به این نظر مجاز نیست");
        }

        // Prepare the new answer
        const newAnswer = {
          ...newCommentData,
          _id: new mongoose.Types.ObjectId(),
          parentId: parent._id,
          parentAnswerId: parentAnswerId || null,
          createdAt: new Date(),
        };

        // Build the update path based on nesting level
        let updatePath = "";
        if (parentAnswerId) {
          // Nested reply (answer to an answer)
          updatePath = `answers.$[parentAnswer].answers`;
        } else {
          // First-level reply (answer to a comment)
          updatePath = "answers";
        }

        // Add the answer to the parent
        const updateResult = await CommentModel.updateOne(
          { _id: parentId },
          {
            $push: {
              [updatePath]: newAnswer,
            },
          },
          {
            arrayFilters: parentAnswerId
              ? [
                  {
                    "parentAnswer._id": new mongoose.Types.ObjectId(
                      parentAnswerId
                    ),
                  },
                ]
              : undefined,
          }
        );

        if (!updateResult.modifiedCount) {
          throw createHttpError.InternalServerError("افزودن پاسخ ناموفق بود");
        }

        return res.status(HttpStatus.CREATED).json({
          statusCode: HttpStatus.CREATED,
          data: {
            message: "پاسخ با موفقیت اضافه شد",
            answerId: newAnswer._id,
          },
        });
      } else {
        // This is a new top-level comment
        newCommentData.openToComment = true; // Allow replies for top-level comments
        const newComment = await CommentModel.create(newCommentData);

        // Add comment reference to product
        await ProductModel.updateOne(
          { _id: productId },
          { $push: { comments: newComment._id } }
        );

        return res.status(HttpStatus.CREATED).json({
          statusCode: HttpStatus.CREATED,
          data: {
            message: "نظر با موفقیت اضافه شد",
            comment: newComment,
          },
        });
      }
    } catch (error) {
      console.error("[ERROR] in addNewComment:", error);
      throw error;
    }
  }
  
  // Helper method to find either a comment or an answer
  async findCommentOrAnswer(parentId, parentAnswerId = null) {
    if (!mongoose.isValidObjectId(parentId)) {
      throw createHttpError.BadRequest("شناسه والد نامعتبر است");
    }

    const comment = await CommentModel.findOne({ _id: parentId });
    if (!comment) throw createHttpError.NotFound("نظر والد یافت نشد");

    // If looking for a specific answer within the comment
    if (parentAnswerId) {
      if (!mongoose.isValidObjectId(parentAnswerId)) {
        throw createHttpError.BadRequest("شناسه پاسخ والد نامعتبر است");
      }

      // Recursive function to find nested answers
      const findAnswer = (answers, answerId) => {
        for (const answer of answers) {
          if (answer._id.equals(answerId)) return answer;
          if (answer.answers && answer.answers.length > 0) {
            const found = findAnswer(answer.answers, answerId);
            if (found) return found;
          }
        }
        return null;
      };

      const parentAnswer = findAnswer(comment.answers, parentAnswerId);
      if (!parentAnswer) throw createHttpError.NotFound("پاسخ والد یافت نشد");
      return parentAnswer;
    }

    return comment;
  }

  async editCommentText(req, res) {
    const { id } = req.params;
    const { text, parentId, parentAnswerId } = req.body;
    const user = req.user;

    await editCommentTextSchema.validateAsync({ text });

    const commentOrAnswer = await this.findCommentOrAnswerForEdit(
      id,
      parentId,
      parentAnswerId
    );

    if (!commentOrAnswer.user.equals(user._id)) {
      throw createHttpError.Forbidden(
        "شما فقط می‌توانید نظرات خود را ویرایش کنید"
      );
    }

    if (commentOrAnswer.status === 2 || commentOrAnswer.status === 0) {
      throw createHttpError.BadRequest(
        "نظر تأیید یا رد شده و قابل ویرایش نیست"
      );
    }

    // Declare arrayFilters variable
    let arrayFilters;
    let updatePath;
    let filter = { _id: parentId || id };

    if (parentId && parentAnswerId) {
      updatePath = `answers.$[parentAnswer].answers.$[answer].content.text`;
      arrayFilters = [
        { "parentAnswer._id": new mongoose.Types.ObjectId(parentAnswerId) },
        { "answer._id": new mongoose.Types.ObjectId(id) },
      ];
    } else if (parentId) {
      updatePath = `answers.$[answer].content.text`;
      arrayFilters = [{ "answer._id": new mongoose.Types.ObjectId(id) }];
    } else {
      updatePath = "content.text";
      arrayFilters = undefined; // No arrayFilters needed for top-level
    }

    const updateResult = await CommentModel.updateOne(
      filter,
      { $set: { [updatePath]: text } },
      { arrayFilters }
    );

    if (!updateResult.modifiedCount) {
      throw createHttpError.InternalServerError("ویرایش نظر ناموفق بود");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "متن نظر با موفقیت ویرایش شد",
      },
    });
  }

  async deleteComment(req, res) {
    const { id } = req.params;
    const user = req.user;
    const isAdmin = user.role === "ADMIN";

    try {
      if (!mongoose.isValidObjectId(id)) {
        throw createHttpError.BadRequest("شناسه نظر نامعتبر است");
      }

      // Try to delete as top-level comment
      const comment = await CommentModel.findOneAndDelete({
        _id: id,
        ...(isAdmin ? {} : { user: user._id }), // If not admin, must be owner
      });

      if (comment) {
        await ProductModel.updateOne(
          { _id: comment.product },
          { $pull: { comments: id } }
        );
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { message: "نظر با موفقیت حذف شد" },
        });
      }

      // Try to delete as answer
      const result = await CommentModel.updateOne(
        { "answers._id": id },
        {
          $pull: {
            answers: {
              _id: id,
              ...(isAdmin ? {} : { user: user._id }), // If not admin, must be owner
            },
          },
        }
      );

      if (result.modifiedCount === 0) {
        // Try to delete as nested answer
        const nestedResult = await CommentModel.updateOne(
          { "answers.answers._id": id },
          {
            $pull: {
              "answers.$[].answers": {
                _id: id,
                ...(isAdmin ? {} : { user: user._id }), // If not admin, must be owner
              },
            },
          }
        );

        if (nestedResult.modifiedCount === 0) {
          throw createHttpError.NotFound("شما مجاز به حذف نظر یا پاسخ نیستید");
        }
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { message: "پاسخ با موفقیت حذف شد" },
      });
    } catch (error) {
      console.error("[ERROR] in deleteComment:", error);
      throw error;
    }
  }
  // Helper method to find comment/answer for edit/delete operations
  async findCommentOrAnswerForEdit(id, parentId = null, parentAnswerId = null) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError.BadRequest("شناسه نظر نامعتبر است");
    }

    if (parentId) {
      const parent = await CommentModel.findOne({ _id: parentId });
      if (!parent) throw createHttpError.NotFound("نظر والد یافت نشد");

      // Recursive function to find the answer
      const findAnswer = (answers, answerId) => {
        for (const answer of answers) {
          if (answer._id.equals(answerId)) return answer;
          if (answer.answers && answer.answers.length > 0) {
            const found = findAnswer(answer.answers, answerId);
            if (found) return found;
          }
        }
        return null;
      };

      // If looking for a specific nested answer
      if (parentAnswerId) {
        const parentAnswer = findAnswer(parent.answers, parentAnswerId);
        if (!parentAnswer) throw createHttpError.NotFound("پاسخ والد یافت نشد");

        const targetAnswer = findAnswer(parentAnswer.answers, id);
        if (!targetAnswer) throw createHttpError.NotFound("پاسخ یافت نشد");
        return targetAnswer;
      }

      // If looking for a first-level answer
      const answer = findAnswer(parent.answers, id);
      if (!answer) throw createHttpError.NotFound("پاسخ یافت نشد");
      return answer;
    }

    // If it's a top-level comment
    const comment = await CommentModel.findById(id);
    if (!comment) throw createHttpError.NotFound("نظر یافت نشد");
    return comment;
  }

  async updateComment(req, res) {
    const { id } = req.params;
    const { status, text } = req.body;
    const user = req.user;

    const data = {};
    if (status !== undefined && user.role === "ADMIN") data.status = status;
    if (text) data["content.text"] = text;

    const comment = await this.findCommentById(id);

    // Check ownership (users can only edit their own comments)
    if (
      comment.user.toString() !== user._id.toString() &&
      user.role !== "ADMIN"
    ) {
      throw createHttpError.Forbidden(
        "شما فقط می‌توانید نظرات خود را ویرایش کنید"
      );
    }

    let updateResult;
    if (comment.openToComment) {
      updateResult = await CommentModel.updateOne({ _id: id }, { $set: data });
    } else {
      updateResult = await CommentModel.updateOne(
        { "answers._id": id },
        { $set: data }
      );
    }

    if (!updateResult.modifiedCount)
      throw createHttpError.InternalServerError("به‌روزرسانی نظر ناموفق بود");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "نظر با موفقیت به‌روزرسانی شد",
      },
    });
  }

  async getAllComments(req, res) {
    try {
      const user = req.user;

      // Only allow ADMIN users to proceed
      if (user.role !== "ADMIN") {
        throw createHttpError.Forbidden(
          "فقط مدیران می‌توانند به همه نظرات دسترسی داشته باشند"
        );
      }

      // Fetch all product comments (with answers)
      const comments = await CommentModel.find({})
        .populate([
          {
            path: "user",
            model: "User",
            select: { name: 1, avatar: 1 },
          },
          {
            path: "product",
            model: "Product",
            select: { title: 1, slug: 1 },
          },
          {
            path: "answers.user",
            model: "User",
            select: { name: 1, avatar: 1 },
          },
        ])
        .sort({ createdAt: -1 });

      // Filter to ensure only product comments are included
      const productComments = comments.filter((comment) => comment.product);

      // Calculate total comments + answers
      const commentsCount = productComments.reduce(
        (total, comment) => total + 1 + comment.answers.length,
        0
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          comments: productComments,
          commentsCount,
        },
      });
    } catch (error) {
      // Pass the error to your error-handling middleware
      throw error;
    }
  }

  async getProductComments(req, res) {
    const { productId } = req.params;
    const user = req.user;
    const statusFilter = user?.role === "ADMIN" ? [0, 1, 2] : [1, 2];

    // If no user, return without like status
    if (!user) {
      const comments = await CommentModel.find({
        product: productId,
        status: { $in: statusFilter },
      })
        .populate({
          path: "user",
          select: "name avatar",
        })
        .lean()
        .sort({ createdAt: -1 });

      // Transform avatar to avatarUrl
      const transformedComments = comments.map((comment) => ({
        ...comment,
        user: {
          ...comment.user,
          avatarUrl: comment.user?.avatar
            ? `${process.env.SERVER_URL}/${comment.user.avatar}`
            : null,
        },
        answers: comment.answers.map((answer) => ({
          ...answer,
          user: {
            ...answer.user,
            avatarUrl: answer.user?.avatar
              ? `${process.env.SERVER_URL}/${answer.user.avatar}`
              : null,
          },
        })),
      }));

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { comments: transformedComments || [] },
      });
    }

    const comments = await CommentModel.find({
      product: productId,
      status: { $in: statusFilter },
    })
      .populate({
        path: "user",
        select: "name avatar",
      })
      .populate({
        path: "answers.user",
        select: "name avatar",
      })
      .lean()
      .sort({ createdAt: -1 });

    // Convert user._id to string for consistent comparison
    const userIdStr = user._id.toString();

    const commentsWithLikes = comments.map((comment) => {
      const isLiked =
        comment.likes?.some(
          (like) =>
            like.toString() === userIdStr ||
            (typeof like === "string" && like === userIdStr)
        ) || false;

      // Transform avatar to avatarUrl for comment user
      const commentUser = comment.user
        ? {
            ...comment.user,
            avatarUrl: comment.user.avatar
              ? `${process.env.SERVER_URL}/${comment.user.avatar}`
              : null,
          }
        : null;

      const answersWithLikes = comment.answers.map((answer) => ({
        ...answer,
        isLiked:
          answer.likes?.some(
            (like) =>
              like.toString() === userIdStr ||
              (typeof like === "string" && like === userIdStr)
          ) || false,
        // Transform avatar to avatarUrl for answer user
        user: answer.user
          ? {
              ...answer.user,
              avatarUrl: answer.user.avatar
                ? `${process.env.SERVER_URL}/${answer.user.avatar}`
                : null,
            }
          : null,
      }));

      return {
        ...comment,
        isLiked,
        user: commentUser,
        answers: answersWithLikes,
      };
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { comments: commentsWithLikes || [] },
    });
  }

  async getOneComment(req, res) {
    const { id } = req.params;
    const user = req.user;

    // Find the comment (throws error if not found)
    await this.findCommentById(id);

    // For regular users, only show if status is 2 (approved)
    // For admins, show regardless of status
    const statusFilter = user?.role === "ADMIN" ? [0, 1, 2] : [2];

    const comment = await CommentModel.findOne({
      $or: [
        { _id: id, status: { $in: statusFilter } },
        { "answers._id": id, "answers.status": { $in: statusFilter } },
      ],
    })
      .populate([
        {
          path: "user",
          model: "User",
          select: { name: 1, avatar: 1 },
        },
        {
          path: "answers.user",
          model: "User",
          select: { name: 1, avatar: 1 },
        },
        {
          path: "product",
          model: "Product",
          select: { title: 1, slug: 1 },
        },
      ])
      .sort({ createdAt: -1 });

    if (!comment)
      throw createHttpError.NotFound("نظر یافت نشد یا تأیید نشده است");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        comment,
      },
    });
  }

  async findCommentById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError.BadRequest("Invalid comment ID");
    }

    const comment = await CommentModel.aggregate([
      {
        $match: {
          $or: [
            { _id: new mongoose.Types.ObjectId(id) },
            { "answers._id": new mongoose.Types.ObjectId(id) },
          ],
        },
      },
      // ... rest of your aggregation pipeline
    ]);

    if (!comment || !comment[0]) {
      throw createHttpError.NotFound("Comment not found");
    }

    // Ensure user field is proper ObjectId
    const result = {
      ...comment[0],
      user: new mongoose.Types.ObjectId(comment[0].user),
    };

    return result;
  }

  async findAcceptedComments(productId, status = 2) {
    const {
      copyObject,
      calculateDateDuration,
    } = require("../../utils/functions");

    const acceptedComments = await CommentModel.aggregate([
      {
        $match: {
          product: new ObjectId(productId),
          status: status,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          user: 1,
          product: 1,
          status: 1,
          openToComment: 1,
          createdAt: 1,
          answers: {
            $filter: {
              input: "$answers",
              as: "answer",
              cond: { $eq: ["$$answer.status", status] },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: { name: 1, avatar: 1 },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
          pipeline: [
            {
              $project: { title: 1, slug: 1, coverImage: 1 },
            },
          ],
        },
      },
      {
        $unwind: "$product",
      },
      {
        $addFields: {
          "user.avatarUrl": {
            $cond: {
              if: "$user.avatar",
              then: { $concat: [process.env.SERVER_URL, "/", "$user.avatar"] },
              else: null,
            },
          },
          "product.coverImageUrl": {
            $cond: {
              if: "$product.coverImage",
              then: {
                $concat: [process.env.SERVER_URL, "/", "$product.coverImage"],
              },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          user: 1,
          product: 1,
          status: 1,
          openToComment: 1,
          createdAt: 1,
          answers: {
            $map: {
              input: "$answers",
              as: "answer",
              in: {
                $mergeObjects: [
                  "$$answer",
                  {
                    user: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$userLookup",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$answer.user"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // Transform dates and add avatar URLs for answer users
    const userLookup = await mongoose
      .model("User")
      .find(
        {
          _id: {
            $in: acceptedComments.flatMap((c) => c.answers.map((a) => a.user)),
          },
        },
        { name: 1, avatar: 1 }
      )
      .lean();

    const transformed = acceptedComments.map((comment) => {
      return {
        ...comment,
        createdAt: calculateDateDuration(comment.createdAt),
        answers: comment.answers.map((answer) => {
          const answerUser = userLookup.find((u) => u._id.equals(answer.user));
          return {
            ...answer,
            createdAt: calculateDateDuration(answer.createdAt),
            user: {
              ...answerUser,
              avatarUrl: answerUser?.avatar
                ? `${process.env.SERVER_URL}/${answerUser.avatar}`
                : null,
            },
          };
        }),
      };
    });

    return copyObject(transformed);
  }

  async likeComment(req, res) {
    const { id } = req.params;
    const user = req.user;

    try {
      // Find the target using the improved method
      const targetInfo = await this.findCommentOrAnswerById(id);
      const target = targetInfo.data;

      // Check if user already liked
      const hasLiked =
        target.likes && target.likes.some((likeId) => likeId.equals(user._id));

      // Build the update path and filters based on the target type
      let updateQuery = {};
      let arrayFilters = [];
      let filter = {};

      if (targetInfo.type === "comment") {
        // Top-level comment
        filter = { _id: id };
        if (hasLiked) {
          updateQuery = { $pull: { likes: user._id } };
        } else {
          updateQuery = {
            $addToSet: { likes: user._id },
            $pull: { dislikes: user._id },
          };
        }
      } else if (targetInfo.type === "answer") {
        // First-level answer
        filter = { _id: targetInfo.parentId };
        arrayFilters = [{ "answer._id": new mongoose.Types.ObjectId(id) }];
        if (hasLiked) {
          updateQuery = { $pull: { "answers.$[answer].likes": user._id } };
        } else {
          updateQuery = {
            $addToSet: { "answers.$[answer].likes": user._id },
            $pull: { "answers.$[answer].dislikes": user._id },
          };
        }
      } else if (targetInfo.type === "nestedAnswer") {
        // Nested answer
        filter = { _id: targetInfo.parentId };
        arrayFilters = [
          { "parentAnswer._id": targetInfo.parentAnswerId },
          { "nestedAnswer._id": new mongoose.Types.ObjectId(id) },
        ];
        if (hasLiked) {
          updateQuery = {
            $pull: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].likes": user._id,
            },
          };
        } else {
          updateQuery = {
            $addToSet: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].likes": user._id,
            },
            $pull: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].dislikes":
                user._id,
            },
          };
        }
      }

      // Execute the update
      const result = await CommentModel.updateOne(filter, updateQuery, {
        arrayFilters: arrayFilters.length ? arrayFilters : undefined,
      });

      if (!result.modifiedCount) {
        throw createHttpError.InternalServerError("عملیات لایک انجام نشد");
      }

      // Get updated counts
      const updatedTargetInfo = await this.findCommentOrAnswerById(id);
      const updatedTarget = updatedTargetInfo.data;

      const message = hasLiked ? "لایک شما برداشته شد" : "مرسی بابت لایک تون";

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message,
          likesCount: updatedTarget.likes ? updatedTarget.likes.length : 0,
          dislikesCount: updatedTarget.dislikes
            ? updatedTarget.dislikes.length
            : 0,
          userLiked: !hasLiked,
          userDisliked: false,
        },
      });
    } catch (error) {
      console.error("[ERROR] in likeComment:", error);
      throw error;
    }
  }

  async dislikeComment(req, res) {
    const { id } = req.params;
    const user = req.user;

    try {
      // Find the target using the improved method
      const targetInfo = await this.findCommentOrAnswerById(id);
      const target = targetInfo.data;

      // Check if user already disliked
      const hasDisliked =
        target.dislikes &&
        target.dislikes.some((dislikeId) => dislikeId.equals(user._id));

      // Build the update path and filters based on the target type
      let updateQuery = {};
      let arrayFilters = [];
      let filter = {};

      if (targetInfo.type === "comment") {
        // Top-level comment
        filter = { _id: id };
        if (hasDisliked) {
          updateQuery = { $pull: { dislikes: user._id } };
        } else {
          updateQuery = {
            $addToSet: { dislikes: user._id },
            $pull: { likes: user._id },
          };
        }
      } else if (targetInfo.type === "answer") {
        // First-level answer
        filter = { _id: targetInfo.parentId };
        arrayFilters = [{ "answer._id": new mongoose.Types.ObjectId(id) }];
        if (hasDisliked) {
          updateQuery = { $pull: { "answers.$[answer].dislikes": user._id } };
        } else {
          updateQuery = {
            $addToSet: { "answers.$[answer].dislikes": user._id },
            $pull: { "answers.$[answer].likes": user._id },
          };
        }
      } else if (targetInfo.type === "nestedAnswer") {
        // Nested answer
        filter = { _id: targetInfo.parentId };
        arrayFilters = [
          { "parentAnswer._id": targetInfo.parentAnswerId },
          { "nestedAnswer._id": new mongoose.Types.ObjectId(id) },
        ];
        if (hasDisliked) {
          updateQuery = {
            $pull: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].dislikes":
                user._id,
            },
          };
        } else {
          updateQuery = {
            $addToSet: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].dislikes":
                user._id,
            },
            $pull: {
              "answers.$[parentAnswer].answers.$[nestedAnswer].likes": user._id,
            },
          };
        }
      }

      // Execute the update
      const result = await CommentModel.updateOne(filter, updateQuery, {
        arrayFilters: arrayFilters.length ? arrayFilters : undefined,
      });

      if (!result.modifiedCount) {
        throw createHttpError.InternalServerError("عملیات دیس لایک انجام نشد");
      }

      // Get updated counts
      const updatedTargetInfo = await this.findCommentOrAnswerById(id);
      const updatedTarget = updatedTargetInfo.data;

      const message = hasDisliked
        ? "دیس لایک شما برداشته شد"
        : "دیس لایک ثبت شد";

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message,
          likesCount: updatedTarget.likes ? updatedTarget.likes.length : 0,
          dislikesCount: updatedTarget.dislikes
            ? updatedTarget.dislikes.length
            : 0,
          userLiked: false,
          userDisliked: !hasDisliked,
        },
      });
    } catch (error) {
      console.error("[ERROR] in dislikeComment:", error);
      throw error;
    }
  }

  async findCommentOrAnswerById(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError.BadRequest("شناسه نامعتبر است");
    }

    // First, try to find as a top-level comment
    const topLevelComment = await CommentModel.findById(id);
    if (topLevelComment) {
      return {
        type: "comment",
        data: topLevelComment,
        parentId: null,
        parentAnswerId: null,
      };
    }

    // If not found as top-level comment, search in answers using aggregation
    const result = await CommentModel.aggregate([
      {
        $match: {
          $or: [
            { "answers._id": new mongoose.Types.ObjectId(id) },
            { "answers.answers._id": new mongoose.Types.ObjectId(id) },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          answers: 1,
        },
      },
    ]);

    if (result.length === 0) {
      throw createHttpError.NotFound("نظر یا پاسخ یافت نشد");
    }

    const parentComment = result[0];

    // Search for the target in first-level answers
    for (const answer of parentComment.answers) {
      if (answer._id.equals(id)) {
        return {
          type: "answer",
          data: answer,
          parentId: parentComment._id,
          parentAnswerId: null,
        };
      }

      // Search in nested answers
      if (answer.answers && answer.answers.length > 0) {
        for (const nestedAnswer of answer.answers) {
          if (nestedAnswer._id.equals(id)) {
            return {
              type: "nestedAnswer",
              data: nestedAnswer,
              parentId: parentComment._id,
              parentAnswerId: answer._id,
            };
          }
        }
      }
    }

    throw createHttpError.NotFound("نظر یا پاسخ یافت نشد");
  }
}

module.exports = {
  CommentController: new CommentController(),
};
