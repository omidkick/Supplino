const expressAsyncHandler = require("express-async-handler");
const { verifyAccessToken , decideAuthMiddleware } = require("../http/middlewares/user.middleware");
const {
  CommentController,
} = require("../http/controllers/comment/comment.controller");

const router = require("express").Router();

router.post(
  "/add",
  verifyAccessToken,
  expressAsyncHandler(CommentController.addNewComment)
);

// router.patch(
//   "/update/:id",
//   verifyAccessToken,
//   expressAsyncHandler(CommentController.updateComment)
// );

router.delete(
  "/remove/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.deleteComment)
);

router.get(
  "/product/:productId",
  decideAuthMiddleware,
  expressAsyncHandler(CommentController.getProductComments)
);

router.patch(
  "/edit-text/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.editCommentText)
);

// In comment routes file
router.post(
  "/like/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.likeComment)
);

router.post(
  "/dislike/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.dislikeComment)
);
module.exports = {
  commentRoutes: router,
};
