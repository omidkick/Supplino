const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  CategoryController,
} = require("../../http/controllers/admin/category/category");
const { uploadFile } = require("../../../utils/multer");

router.post(
  "/add",
  uploadFile.single("categoryImage"),
  expressAsyncHandler(CategoryController.addNewCategory)
);
router.patch(
  "/update/:id",
  uploadFile.single("categoryImage"),
  expressAsyncHandler(CategoryController.updateCategory)
);
router.delete(
  "/remove/:id",
  expressAsyncHandler(CategoryController.removeCategory)
);

module.exports = {
  categoryAdminRoutes: router,
};
