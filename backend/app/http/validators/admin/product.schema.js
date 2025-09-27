const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../../utils/constants");

const addProductSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(30)
    .error(createError.BadRequest("عنوان محصول صحیح نمیباشد")),

  description: Joi.string()
    .required()
    .error(createError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),

  slug: Joi.string()
    .required()
    .error(createError.BadRequest("اسلاگ ارسال شده صحیح نمیباشد")),

  brand: Joi.string()
    .required()
    .error(createError.BadRequest("برند محصول صحیح نمی باشد.")),

  countInStock: Joi.number()
    .required()
    .error(createError.BadRequest("موجودی محصول صحیح نمی باشد.")),

  // imageLink: Joi.string()
  //   .required()
  //   .error(createError.BadRequest("لینک عکس دوره صحیح نمیباشد")),

  // ✅ Made imageLink optional since it's not used in the frontend
// imageLink: Joi.string().uri().optional().allow(null, ""),

    
  tags: Joi.array()
    .items(Joi.string())
    .min(0)
    .max(20)
    .error(createError.BadRequest("برچسب ها نمیتواند بیشتر از 20 ایتم باشد")),

  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("دسته بندی مورد نظر  صحیح نمی باشد")),

  offPrice: Joi.number().error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),

  price: Joi.number()
    .required()
    .error(createError.BadRequest("قیمت وارد شده صحیح نمیباشد")),

  discount: Joi.number()
    .allow(0)
    .error(createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")),

  // ✅ These fields are handled by multer and should be ignored in validation
  coverImagePath: Joi.string().optional(),

  thumbnailPaths: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().required(),
        path: Joi.string().required(),
        originalName: Joi.string().required(),
      })
    )
    .optional(),

  // ✅ Legacy fields that might still come in requests
  fileUploadPath: Joi.string().allow("", null).optional(),
  thumbnailFiles: Joi.array().optional(),
}).unknown(true); // ✅ Allow extra fields from multer

const changeCourseDiscountSchema = Joi.object({
  offPrice: Joi.number()
    .required()
    .error(createError.BadRequest("قیمت وارد شده صحیح نمیباشد")),
  discount: Joi.number()
    .required()
    .allow(0)
    .error(createError.BadRequest("تخفیف وارد شده صحیح نمیباشد")),
});

module.exports = {
  addProductSchema,
  changeCourseDiscountSchema,
};
