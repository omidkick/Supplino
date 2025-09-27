const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const {
  copyObject,
  deleteInvalidPropertyInObject,
} = require("../../../../../utils/functions");
const createHttpError = require("http-errors");
const { transformProduct } = require("../../../../../utils/transformProduct");
const ObjectId = mongoose.Types.ObjectId;
const { CategoryModel } = require("../../../../models/category");
const { UserModel } = require("../../../../models/user");
const { ProductModel } = require("../../../../models/product");
const {
  addProductSchema,
  changeCourseDiscountSchema,
} = require("../../../validators/admin/product.schema");

class ProductController extends Controller {
  async addNewProduct(req, res) {
    const { ...rest } = req.body;

    // Clean the body data before validation
    const cleanedBody = { ...rest };
    delete cleanedBody.coverImagePath;
    delete cleanedBody.thumbnailPaths;

    await addProductSchema.validateAsync(cleanedBody);

    const {
      title,
      description,
      slug,
      // imageLink,
      brand,
      tags,
      category,
      price,
      discount = 0,
      offPrice,
      countInStock,
    } = cleanedBody;

    // ✅ Handle cover image - now using the path set by multer
    let coverImage;
    if (req.body.coverImagePath) {
      coverImage = req.body.coverImagePath;
    } else {
      throw createHttpError.BadRequest("کاور محصول را اپلود کنید");
    }

    // ✅ Handle thumbnail images - now using paths set by multer
    const thumbnails = [];
    if (req.body.thumbnailPaths && Array.isArray(req.body.thumbnailPaths)) {
      req.body.thumbnailPaths.forEach((fileInfo, index) => {
        thumbnails.push({
          path: fileInfo.path,
          alt: `${title} - تصویر ${index + 1}`,
          order: index,
          isActive: true,
        });
      });
    }

    const product = await ProductModel.create({
      title,
      description,
      slug,
      // imageLink,
      coverImage,
      thumbnails, // ✅ Add thumbnails array
      brand,
      tags,
      category,
      price,
      discount,
      offPrice,
      countInStock,
    });

    if (!product?._id)
      throw createHttpError.InternalServerError("محصول ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "محصول با موفقیت ایجاد شد",
        product,
      },
    });
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { ...rest } = req.body;

    const product = await this.findProductById(id);

    // Clean the body data
    const cleanedBody = { ...rest };
    delete cleanedBody.coverImagePath;
    delete cleanedBody.thumbnailPaths;

    const data = copyObject(cleanedBody);
    let blackListFields = ["bookmarks", "likes", "reviews", "thumbnails"];
    deleteInvalidPropertyInObject(data, blackListFields);

    let coverImage = product.coverImage;
    let thumbnails = [...(product.thumbnails || [])];

    // ✅ Handle cover image update
    if (req.body.coverImagePath) {
      // Delete old cover image file if it exists
      if (product.coverImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "..",
          product.coverImage
        );
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (error) {
            console.log("Could not delete old cover image:", error.message);
          }
        }
      }
      coverImage = req.body.coverImagePath;
    }

    // ✅ Handle thumbnail updates
    if (req.body.thumbnailPaths && Array.isArray(req.body.thumbnailPaths)) {
      const newThumbnails = req.body.thumbnailPaths.map((fileInfo, index) => ({
        path: fileInfo.path,
        alt: `${data.title || product.title} - تصویر ${
          thumbnails.length + index + 1
        }`,
        order: thumbnails.length + index,
        isActive: true,
      }));
      thumbnails = [...thumbnails, ...newThumbnails];
    }

    const updateProductResult = await ProductModel.updateOne(
      { _id: id },
      {
        $set: { ...data, coverImage, thumbnails },
      }
    );

    if (!updateProductResult.modifiedCount)
      throw createHttpError.InternalServerError("به روزرسانی محصول انجام نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی محصول با موفقیت انجام شد",
      },
    });
  }

  async updateProductThumbnails(req, res) {
    const { id } = req.params;
    const product = await this.findProductById(id);

    if (
      !req.body.thumbnailPaths ||
      !Array.isArray(req.body.thumbnailPaths) ||
      req.body.thumbnailPaths.length === 0
    ) {
      throw createHttpError.BadRequest("هیچ تصویری ارسال نشده است");
    }

    const newThumbnails = req.body.thumbnailPaths.map((fileInfo, index) => ({
      path: fileInfo.path,
      alt: `${product.title} - تصویر ${
        (product.thumbnails?.length || 0) + index + 1
      }`,
      order: (product.thumbnails?.length || 0) + index,
      isActive: true,
    }));

    const updatedThumbnails = [...(product.thumbnails || []), ...newThumbnails];

    const updateResult = await ProductModel.updateOne(
      { _id: id },
      { $set: { thumbnails: updatedThumbnails } }
    );

    if (!updateResult.modifiedCount)
      throw createHttpError.InternalServerError("اضافه کردن تصاویر انجام نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "تصاویر با موفقیت اضافه شدند",
        thumbnailsCount: updatedThumbnails.length,
      },
    });
  }

  async removeThumbnail(req, res) {
    const { productId, thumbnailIndex } = req.params;
    const product = await this.findProductById(productId);

    if (!product.thumbnails || product.thumbnails.length === 0) {
      throw createHttpError.BadRequest("محصول تصویری ندارد");
    }

    const index = parseInt(thumbnailIndex);
    if (index < 0 || index >= product.thumbnails.length) {
      throw createHttpError.BadRequest("ایندکس تصویر نامعتبر است");
    }

    // Delete the thumbnail file
    const thumbnailToDelete = product.thumbnails[index];
    if (thumbnailToDelete && thumbnailToDelete.path) {
      const thumbnailPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        thumbnailToDelete.path
      );
      if (fs.existsSync(thumbnailPath)) {
        try {
          fs.unlinkSync(thumbnailPath);
        } catch (error) {
          console.log("Could not delete thumbnail file:", error.message);
        }
      }
    }

    // Remove thumbnail at specified index
    const updatedThumbnails = product.thumbnails.filter((_, i) => i !== index);

    // Reorder remaining thumbnails
    updatedThumbnails.forEach((thumb, i) => {
      thumb.order = i;
    });

    const updateResult = await ProductModel.updateOne(
      { _id: productId },
      { $set: { thumbnails: updatedThumbnails } }
    );

    if (!updateResult.modifiedCount)
      throw createHttpError.InternalServerError("حذف تصویر انجام نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "تصویر با موفقیت حذف شد",
        remainingThumbnails: updatedThumbnails.length,
      },
    });
  }

  async updateCoverImage(req, res) {
    const { id } = req.params;
    const product = await this.findProductById(id);

    if (!req.body.coverImagePath) {
      throw createHttpError.BadRequest("تصویر کاور ارسال نشده است");
    }

    // Delete old cover image file if it exists
    if (product.coverImage) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        product.coverImage
      );
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.log("Could not delete old cover image:", error.message);
        }
      }
    }

    const updateResult = await ProductModel.updateOne(
      { _id: id },
      { $set: { coverImage: req.body.coverImagePath } }
    );

    if (!updateResult.modifiedCount)
      throw createHttpError.InternalServerError(
        "به روزرسانی تصویر کاور انجام نشد"
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "تصویر کاور با موفقیت به روزرسانی شد",
      },
    });
  }

  async getListOfProducts(req, res) {
    let dbQuery = {};
    const user = req.user;
    let {
      search,
      category,
      sort,
      brand,
      type,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page,
      limit,
    } = req.query;

    // pagination support
    page = Number(page) || 1;
    limit = Number(limit) || 9;
    const skip = (page - 1) * limit;

    if (search) dbQuery["$text"] = { $search: search };

    if (category) {
      const categories = category.split(",");
      const categoryIds = [];
      for (const item of categories) {
        const categoryDoc = await CategoryModel.findOne({ englishTitle: item });
        if (categoryDoc) {
          categoryIds.push(categoryDoc._id);
        }
      }
      if (categoryIds.length > 0) {
        dbQuery["category"] = { $in: categoryIds };
      }
    }

    // Add brand filtering
    if (brand) {
      const brands = brand.split(",");
      dbQuery["brand"] = { $in: brands };
    }

    if (type) {
      const types = type.split(",");
      for (const filterType of types) {
        switch (filterType) {
          case "discounted":
            dbQuery["discount"] = { $gt: 0 };
            break;
          case "no-discount":
            dbQuery["discount"] = { $eq: 0 };
            break;
          case "in-stock":
            dbQuery["countInStock"] = { $gt: 0 };
            break;
          case "out-of-stock":
            dbQuery["countInStock"] = { $eq: 0 };
            break;
          case "high-rated":
            dbQuery["rating"] = { $gte: 4 };
            break;
          case "new-arrivals":
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
            dbQuery["createdAt"] = { $gte: thirtyDaysAgo };
            break;
        }
      }
    }

    if (minPrice || maxPrice) {
      dbQuery["price"] = {};
      if (minPrice) dbQuery["price"]["$gte"] = Number(minPrice);
      if (maxPrice) dbQuery["price"]["$lte"] = Number(maxPrice);
    }

    if (minRating) {
      dbQuery["rating"] = { $gte: Number(minRating) };
    }

    if (inStock !== undefined) {
      dbQuery["countInStock"] = inStock === "true" ? { $gt: 0 } : { $eq: 0 };
    }

    const sortQuery = {};
    if (!sort) sortQuery["createdAt"] = 1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
      if (sort === "popular") sortQuery["likes"] = -1;
      if (sort === "price-low") sortQuery["price"] = 1;
      if (sort === "price-high") sortQuery["price"] = -1;
      if (sort === "rating") sortQuery["rating"] = -1;
      if (sort === "discount") sortQuery["discount"] = -1;
    }

    // Get total count for pagination
    const totalCount = await ProductModel.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalCount / limit);

    const products = await ProductModel.find(dbQuery, { reviews: 0 })
      .populate([
        { path: "category", select: { title: 1, englishTitle: 1, icon: 1 } },
      ])
      .sort(sortQuery)
      .limit(limit)
      .skip(skip);

    const transformedProducts = copyObject(products);

    for (const product of transformedProducts) {
      await transformProduct(product, user);
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        products: transformedProducts,
        totalCount,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        filters: {
          search,
          category,
          brand,
          type,
          minPrice,
          maxPrice,
          minRating,
          inStock,
          sort,
        },
      },
    });
  }

  async getProductById(req, res) {
    const { id: productId } = req.params;
    const user = req.user;
    await this.findProductById(productId);
    const product = await ProductModel.findById(productId).populate([
      {
        path: "category",
        model: "Category",
        select: {
          title: 1,
          icon: 1,
          englishTitle: 1,
        },
      },
    ]);

    const transformedProduct = copyObject(product);
    await transformProduct(transformedProduct, user);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        product: transformedProduct,
      },
    });
  }

  async getOneProductBySlug(req, res) {
    const { slug } = req.params;
    const user = req.user;
    const product = await ProductModel.findOne({ slug }).populate([
      {
        path: "category",
        model: "Category",
        select: {
          title: 1,
          icon: 1,
          englishTitle: 1,
        },
      },
    ]);

    if (!product)
      throw createHttpError.NotFound("محصولی با این مشخصات یافت نشد");

    const transformedProduct = copyObject(product);
    await transformProduct(transformedProduct, user);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        product: transformedProduct,
      },
    });
  }

  async changeProductDiscountStatus(req, res) {
    const { id } = req.params;
    await this.findProductById(id);
    await changeCourseDiscountSchema.validateAsync(req.body);
    const { discount, offPrice } = req.body;
    const result = await ProductModel.updateOne(
      { _id: id },
      { $set: { discount, offPrice } }
    );
    if (result.modifiedCount > 0) {
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "وضعیت تخفیف محصول فعال شد",
        },
      });
    }
    throw createHttpError.BadRequest("تغییر انجام نشد مجددا تلاش کنید");
  }

  async removeProduct(req, res) {
    const { id } = req.params;
    const product = await this.findProductById(id);

    // Delete associated files
    if (product.coverImage) {
      const coverImagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        product.coverImage
      );
      if (fs.existsSync(coverImagePath)) {
        try {
          fs.unlinkSync(coverImagePath);
        } catch (error) {
          console.log("Could not delete cover image:", error.message);
        }
      }
    }

    if (product.thumbnails && product.thumbnails.length > 0) {
      product.thumbnails.forEach((thumbnail) => {
        const thumbnailPath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "..",
          thumbnail.path
        );
        if (fs.existsSync(thumbnailPath)) {
          try {
            fs.unlinkSync(thumbnailPath);
          } catch (error) {
            console.log("Could not delete thumbnail:", error.message);
          }
        }
      });
    }

    const deleteResult = await ProductModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount == 0)
      throw createHttpError.InternalServerError("حذف محصول انجام نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "حذف محصول با موفقیت انجام شد",
      },
    });
  }

  async likeProduct(req, res) {
    const { id: productId } = req.params;
    const user = req.user;
    const product = await this.findProductById(productId);
    const likedProduct = await ProductModel.findOne({
      _id: productId,
      likes: user._id,
    });
    const updateProductQuery = likedProduct
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };

    const updateUserQuery = likedProduct
      ? { $pull: { likedProducts: product._id } }
      : { $push: { likedProducts: product._id } };

    const productUpdate = await ProductModel.updateOne(
      { _id: productId },
      updateProductQuery
    );
    const userUpdate = await UserModel.updateOne(
      { _id: user._id },
      updateUserQuery
    );

    if (productUpdate.modifiedCount === 0 || userUpdate.modifiedCount === 0)
      throw createHttpError.BadRequest("عملیات ناموفق بود.");

    let message;
    if (!likedProduct) {
      message = "مرسی بابت لایک تون";
    } else message = "لایک شما برداشته شد";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }

  async findProductById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه محصول ارسال شده صحیح نمیباشد");
    const product = await ProductModel.findById(id);
    if (!product) throw createHttpError.NotFound("محصولی یافت نشد.");
    return product;
  }
  // product.controller.js - Add this method to the ProductController class
  async toggleBookmark(req, res) {
    const { id: productId } = req.params;
    const user = req.user;
    const product = await this.findProductById(productId);

    // Check if product is already bookmarked
    const bookmarkedProduct = await ProductModel.findOne({
      _id: productId,
      bookmarks: user._id,
    });

    const updateProductQuery = bookmarkedProduct
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };

    const updateUserQuery = bookmarkedProduct
      ? { $pull: { bookmarkedProducts: product._id } }
      : { $push: { bookmarkedProducts: product._id } };

    const productUpdate = await ProductModel.updateOne(
      { _id: productId },
      updateProductQuery
    );
    const userUpdate = await UserModel.updateOne(
      { _id: user._id },
      updateUserQuery
    );

    if (productUpdate.modifiedCount === 0 || userUpdate.modifiedCount === 0) {
      throw createHttpError.BadRequest("عملیات بوکمارک محصول انجام نشد !");
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: bookmarkedProduct
          ? "محصول از نشان‌ها حذف شد"
          : "محصول به نشان‌ها اضافه شد",
        isBookmarked: !bookmarkedProduct,
      },
    });
  }
}

module.exports = {
  ProductController: new ProductController(),
};
