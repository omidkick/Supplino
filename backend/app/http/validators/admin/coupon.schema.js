// coupon.schema.js
const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constants");

const addCouponSchema = Joi.object({
  code: Joi.string()
    .required()
    .min(3)
    .max(30)
    .error(createHttpError.BadRequest("کد تخفیف باید بین ۳ تا ۳۰ کاراکتر باشد")),
  type: Joi.string()
    .required()
    .valid("fixed", "percentage") // Changed to match frontend
    .error(createHttpError.BadRequest("نوع کد تخفیف را به درستی وارد کنید")),
  amount: Joi.number()
    .required()
    .min(1)
    .error(createHttpError.BadRequest("مقدار کد تخفیف را به درستی وارد کنید")),
  expireDate: Joi.date()
    .min('now')
    .required()
    .error(createHttpError.BadRequest("تاریخ انقضا باید در آینده باشد")),
  usageLimit: Joi.number()
    .min(1)
    .required()
    .error(createHttpError.BadRequest("ظرفیت کد تخفیف را به درستی وارد کنید")),
  productIds: Joi.array()
    .items(Joi.string().regex(MongoIDPattern))
    .default([])
    .error(createHttpError.BadRequest("شناسه محصول صحیح نمی باشد")),
});

module.exports = {
  addCouponSchema,
};