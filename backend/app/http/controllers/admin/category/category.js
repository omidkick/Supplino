const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../../../validators/admin/category.shcema");
const { CategoryModel } = require("../../../../models/category");
const path = require("path");
const fs = require("fs");

class CategoryController extends Controller {
  async getListOfCategories(req, res) {
    const query = req.query;
    const dbQuery = {};

    // Build search conditions array
    const searchConditions = [];

    // Handle individual field searches
    if (query.title) {
      searchConditions.push({ title: { $regex: query.title, $options: "i" } });
    }
    if (query.englishTitle) {
      searchConditions.push({
        englishTitle: { $regex: query.englishTitle, $options: "i" },
      });
    }
    if (query.description) {
      searchConditions.push({
        description: { $regex: query.description, $options: "i" },
      });
    }

    // Handle general search parameter (searches across all fields)
    if (query.search) {
      searchConditions.push(
        { title: { $regex: query.search, $options: "i" } },
        { englishTitle: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } }
      );
    }

    // If we have any search conditions, use $or
    if (searchConditions.length > 0) {
      dbQuery.$or = searchConditions;
    }

    // Add other filters (non-search)
    if (query.type) {
      dbQuery.type = query.type;
    }
    if (query.parent) {
      dbQuery.parent = query.parent;
    }

    const categories = await CategoryModel.find(dbQuery);

    // Add full image URLs
    const categoriesWithUrls = categories.map((category) => ({
      ...category.toObject(),
      imageUrl: category.image
        ? `${process.env.SERVER_URL}/${category.image}`
        : null,
    }));

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        categories: categoriesWithUrls,
      },
    });
  }
  async addNewCategory(req, res) {
    const { title, englishTitle, description, type, parent } =
      await addCategorySchema.validateAsync(req.body);
    await this.findCategoryWithTitle(englishTitle);

    // NEW: Handle category image
    let image = null;
    if (req.body.imagePath) {
      image = req.body.imagePath;
    }

    const category = await CategoryModel.create({
      title,
      englishTitle,
      description,
      type,
      parent,
      image, // NEW: Add image to category
    });

    if (!category) throw createHttpError.InternalServerError("خطای داخلی");
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "دسته بندی با موفقیت افزوده شد",
      },
    });
  }

  async findCategoryWithTitle(englishTitle) {
    const category = await CategoryModel.findOne({ englishTitle });
    if (category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود دارد.");
  }
  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود ندارد.");
    return category;
  }
  async updateCategory(req, res) {
    const { id } = req.params;
    const { title, englishTitle, type, description } = req.body;
    const category = await this.checkExistCategory(id);
    await updateCategorySchema.validateAsync(req.body);

    // NEW: Handle category image update
    let image = category.image;
    if (req.body.imagePath) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "..",
          category.image
        );
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (error) {
            console.log("Could not delete old category image:", error.message);
          }
        }
      }
      image = req.body.imagePath;
    }

    const updateResult = await CategoryModel.updateOne(
      { _id: id },
      {
        $set: { title, englishTitle, type, description, image },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.InternalServerError("به روزرسانی انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }

  async removeCategory(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);

    // NEW: Delete category image if it exists
    if (category.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        category.image
      );
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.log("Could not delete category image:", error.message);
        }
      }
    }

    const deleteResult = await CategoryModel.deleteMany({
      $or: [{ _id: category._id }, { parentId: category._id }],
    });
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError("حدف دسته بندی انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "حذف دسته بندی با موفقیت انجام شد",
      },
    });
  }

  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        category,
      },
    });
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};
