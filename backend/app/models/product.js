const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: { type: ObjectId, ref: "Category", required: true },
    // imageLink: { type: String, required: true },
    coverImage: { type: String, required: true, unique: true },

    // ✅ NEW: Thumbnail images array
    thumbnails: [
      {
        path: { type: String, required: true },
        alt: { type: String, default: "" },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],

    price: { type: Number, required: true },
    offPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brand: { type: String, required: true },
    tags: [{ type: String }],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    likes: { type: [ObjectId], ref: "User", default: [] },
    bookmarks: { type: [ObjectId], ref: "User", default: [] },
    comments: [{ type: ObjectId, ref: "Comment" }],
     saleCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// ✅ Virtual for cover image URL
ProductSchema.virtual("coverImageUrl").get(function () {
  if (this.coverImage) return `${process.env.SERVER_URL}/${this.coverImage}`;
  return null;
});

// ✅ NEW: Virtual for thumbnail URLs
ProductSchema.virtual("thumbnailUrls").get(function () {
  if (!this.thumbnails || this.thumbnails.length === 0) return [];

  return this.thumbnails
    .filter((thumb) => thumb.isActive)
    .sort((a, b) => a.order - b.order)
    .map((thumb) => ({
      url: `${process.env.SERVER_URL}/${thumb.path}`,
      alt: thumb.alt,
      order: thumb.order,
    }));
});

// ✅ Indexes for search and performance
ProductSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  tags: "text",
});

ProductSchema.index({ price: 1 });
ProductSchema.index({ discount: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ countInStock: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ slug: 1 });

module.exports = {
  ProductModel: mongoose.model("Product", ProductSchema),
};
