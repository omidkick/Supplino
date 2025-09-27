const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  ProductController,
} = require("../../http/controllers/admin/product/product.controller");
const { uploadFile, uploadProductFiles } = require("../../../utils/multer");


router.post(
  "/add",
  uploadProductFiles.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnails", maxCount: 5 }, 
  ]),
  expressAsyncHandler(ProductController.addNewProduct)
);

router.delete(
  "/remove/:id",
  expressAsyncHandler(ProductController.removeProduct)
);


router.patch(
  "/update/:id",
  uploadProductFiles.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnails", maxCount: 5 },
  ]),
  expressAsyncHandler(ProductController.updateProduct)
);

router.patch(
  "/change-discount/:id",
  expressAsyncHandler(ProductController.changeProductDiscountStatus)
);


router.patch(
  "/thumbnails/:id",
  uploadProductFiles.array("thumbnails", 5),
  expressAsyncHandler(ProductController.updateProductThumbnails)
);

router.delete(
  "/thumbnails/:productId/:thumbnailIndex",
  expressAsyncHandler(ProductController.removeThumbnail)
);

module.exports = {
  productsAdminRoutes: router,
};
