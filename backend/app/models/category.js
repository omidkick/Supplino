const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
    description: { type: String, required: true, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ["product", "comment", "post", "ticket"],
      default: "product",
      required: true,
    },
    parentId: {
      type: ObjectId,
      ref: "Category",
      default: null,
    },
    icon: {
      sm: { type: String, default: null },
      lg: { type: String, default: null },
    },
    // NEW: Add image field for category
    image: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ title: "text", englishTitle: "text" });

// NEW: Virtual for image URL
CategorySchema.virtual("imageUrl").get(function () {
  if (this.image) return `${process.env.SERVER_URL}/${this.image}`;
  return null;
});

module.exports = {
  CategoryModel: mongoose.model("Category", CategorySchema),
};
