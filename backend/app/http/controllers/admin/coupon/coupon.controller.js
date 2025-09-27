// coupon.controller.js - Fixed version
const Controller = require("../../controller");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { addCouponSchema } = require("../../../validators/admin/coupon.schema");
const {
  checkProductExist,
  deleteInvalidPropertyInObject,
  copyObject,
} = require("../../../../../utils/functions");
const { CouponModel } = require("../../../../models/coupon");
const mongoose = require("mongoose");

class CouponController extends Controller {
  async addNewCoupon(req, res, next) {
    try {
      await addCouponSchema.validateAsync(req.body);
      const {
        code,
        type,
        productIds = [],
        amount,
        usageLimit,
        expireDate = null,
      } = req.body;
      
      // Check if products exist
      for (const productId of productIds) {
        await checkProductExist(productId);
      }
      
      // Check if coupon code already exists
      const existingCoupon = await CouponModel.findOne({ code });
      if (existingCoupon) {
        throw createHttpError.Conflict("کد تخفیف از قبل وجود دارد");
      }
      
      const coupon = await CouponModel.create({
        type,
        code,
        productIds,
        amount,
        usageLimit,
        expireDate,
      });

      if (!coupon?._id) {
        throw createHttpError.InternalServerError("کد تخفیف ثبت نشد");
      }

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "کد تخفیف با موفقیت ایجاد شد",
          coupon,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async updateCoupon(req, res, next) {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError.BadRequest("شناسه کد تخفیف معتبر نیست");
      }
      
      const coupon = await this.findCouponById(id);
      const data = copyObject(req.body);
      deleteInvalidPropertyInObject(data);
      
      // If code is being updated, check if it already exists
      if (data.code && data.code !== coupon.code) {
        const existingCoupon = await CouponModel.findOne({ 
          code: data.code, 
          _id: { $ne: id } 
        });
        if (existingCoupon) {
          throw createHttpError.Conflict("کد تخفیف از قبل وجود دارد");
        }
      }
      
      const updateResult = await CouponModel.updateOne(
        { _id: id },
        { $set: data }
      );
      
      if (updateResult.modifiedCount === 0) {
        throw createHttpError.InternalServerError("کد تخفیف آپدیت نشد");
      }
      
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کد تخفیف با موفقیت آپدیت شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async removeCoupon(req, res, next) {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError.BadRequest("شناسه کد تخفیف معتبر نیست");
      }
      
      await this.findCouponById(id);
      const deleteResult = await CouponModel.deleteOne({ _id: id });
      
      if (deleteResult.deletedCount === 0) {
        throw createHttpError.InternalServerError("کد تخفیف حذف نشد");
      }
      
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کد تخفیف با موفقیت حذف شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getAllCoupons(req, res, next) {
    try {
      const coupons = await CouponModel.find({}).populate([
        {
          path: "productIds",
          model: "Product",
          select: { title: 1, slug: 1 },
        },
      ]);
      
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          coupons,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getOneCoupon(req, res, next) {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError.BadRequest("شناسه کد تخفیف معتبر نیست");
      }
      
      const coupon = await CouponModel.findOne({ _id: id }).populate([
        {
          path: "productIds",
          model: "Product",
          select: { title: 1, slug: 1 },
        },
      ]);
      
      if (!coupon) {
        throw createHttpError.NotFound("کد تخفیف پیدا نشد");
      }
      
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          coupon,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async findCouponById(id) {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError.BadRequest("شناسه کد تخفیف معتبر نیست");
    }
    
    const coupon = await CouponModel.findById(id);
    
    if (!coupon) {
      throw createHttpError.NotFound("کد تخفیف با این مشخصات یافت نشد");
    }
    
    return copyObject(coupon);
  }
}

module.exports = {
  CouponController: new CouponController(),
};