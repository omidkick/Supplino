const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const { adminRoutes } = require("./admin/admin.routes");
const { cartRoutes } = require("./cart");
const { categoryRoutes } = require("./category");
const { commentRoutes } = require("./comment");
const { paymentRoutes } = require("./payment");
const { productRoutes } = require("./product");
const { supportRoutes } = require("./support");
const { userAuthRoutes } = require("./user.routes");

const router = require("express").Router();

router.use("/user", userAuthRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/payment", paymentRoutes);
router.use("/cart", verifyAccessToken, cartRoutes);
router.use("/admin", verifyAccessToken, adminRoutes);
router.use('/comment', commentRoutes)
router.use('/support', supportRoutes)

module.exports = {
  allRoutes: router,
};
