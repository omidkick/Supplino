const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constants");

// Schema for the "content" object
const contentSchema = Joi.object({
  text: Joi.string()
    .min(3)
    .max(2000)
    .required()
    .error(() => {
      throw createHttpError.BadRequest("متن نظر را به درستی وارد کنید");
    }),
});

// Schema for adding a new comment
const addNewCommentSchema = Joi.object({
  text: Joi.string()
    .min(3)
    .max(2000)
    .required()
    .error(() => {
      throw createHttpError.BadRequest("متن نظر را به درستی وارد کنید");
    }),
  productId: Joi.string()
    .pattern(MongoIDPattern)
    .required()
    .error(() => {
      throw createHttpError.BadRequest("شناسه محصول را به درستی وارد کنید");
    }),
  parentId: Joi.string()
    .pattern(MongoIDPattern)
    .allow("")
    .optional()
    .error(() => {
      throw createHttpError.BadRequest("شناسه نظر والد را به درستی وارد کنید");
    }),
  parentAnswerId: Joi.string()
    .pattern(MongoIDPattern)
    .allow("")
    .optional()
    .error(() => {
      throw createHttpError.BadRequest("شناسه پاسخ والد را به درستی وارد کنید");
    }),
});

// Schema for editing comment text
const editCommentTextSchema = Joi.object({
  text: Joi.string()
    .min(3)
    .max(2000)
    .required()
    .error(() => {
      throw createHttpError.BadRequest("متن نظر را به درستی وارد کنید");
    }),
  parentId: Joi.string()
    .pattern(MongoIDPattern)
    .allow("")
    .optional()
    .error(() => {
      throw createHttpError.BadRequest("شناسه نظر والد را به درستی وارد کنید");
    }),
  parentAnswerId: Joi.string()
    .pattern(MongoIDPattern)
    .allow("")
    .optional()
    .error(() => {
      throw createHttpError.BadRequest("شناسه پاسخ والد را به درستی وارد کنید");
    }),
});

module.exports = {
  addNewCommentSchema,
  editCommentTextSchema,
};