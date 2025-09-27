const { ROLES } = require("../../../utils/constants");
const { authorize } = require("../../http/middlewares/permission.guard");
const { categoryAdminRoutes } = require("./category");
const { commentAdminRoutes } = require("./comment");
const { couponAdminRoutes } = require("./coupon");
const { paymentAdminRoutes } = require("./payment");
const { productsAdminRoutes } = require("./product");
const { supportAdminRoutes } = require("./support");
const { userAdminRoutes } = require("./user");

const router = require("express").Router();

router.use("/category", authorize(ROLES.ADMIN), categoryAdminRoutes);
router.use("/product", authorize(ROLES.ADMIN), productsAdminRoutes);
router.use("/coupon", authorize(ROLES.ADMIN), couponAdminRoutes);
router.use("/user", authorize(ROLES.ADMIN), userAdminRoutes);
router.use("/payment", authorize(ROLES.ADMIN), paymentAdminRoutes);
router.use("/comment", authorize(ROLES.ADMIN), commentAdminRoutes);
router.use("/support", authorize(ROLES.ADMIN), supportAdminRoutes);

module.exports = {
  adminRoutes: router,
};
