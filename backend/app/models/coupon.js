// models/coupon.js
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["fixed", "percentage"], // Changed to match frontend
    },
    amount: { type: Number, required: true },
    expireDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    usageCount: { type: Number, required: true, default: 0 },
    usageLimit: { type: Number, required: true },
    productIds: {
      type: [ObjectId],
      ref: "Product",
      default: [],
    },
  },
  { timestamps: true }
);

// Add validation for percentage type
CouponSchema.pre('save', function(next) {
  if (this.type === 'percentage' && this.amount > 100) {
    return next(new Error('برای تخفیف درصدی، مقدار نمی‌تواند بیشتر از ۱۰۰ باشد'));
  }
  next();
});

module.exports = {
  CouponModel: mongoose.model("Coupon", CouponSchema),
};