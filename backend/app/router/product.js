const expressAsyncHandler = require("express-async-handler");
const {
  ProductController,
} = require("../http/controllers/admin/product/product.controller");
const {
  decideAuthMiddleware,
  verifyAccessToken,
} = require("../http/middlewares/user.middleware");

const router = require("express").Router();

router.get(
  "/list",
  decideAuthMiddleware,
  expressAsyncHandler(ProductController.getListOfProducts)
);
router.get(
  "/slug/:slug",
  decideAuthMiddleware,
  expressAsyncHandler(ProductController.getOneProductBySlug)
);
router.post(
  "/like/:id",
  verifyAccessToken,
  expressAsyncHandler(ProductController.likeProduct)
);

router.get(
  "/:id",
  decideAuthMiddleware,
  expressAsyncHandler(ProductController.getProductById)
);
router.post(
  "/bookmark/:id",
  verifyAccessToken,
  expressAsyncHandler(ProductController.toggleBookmark)
);
module.exports = {
  productRoutes: router,
};
