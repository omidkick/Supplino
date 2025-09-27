const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const AnswerSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    content: {
      text: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 2000,
      },
    },
    status: {
      type: Number,
      required: true,
      default: 1,
      enum: [0, 1, 2],
    },
    openToComment: { type: Boolean, default: false },
    parentId: { type: ObjectId, ref: "Comment" }, // Track parent comment ID
    parentAnswerId: { type: ObjectId }, // Track parent answer ID for nested replies
    answers: { type: [this], default: [] }, // Recursive structure for nested answers
     likes: [{ type: ObjectId, ref: "User" }],
  dislikes: [{ type: ObjectId, ref: "User" }],
    
  },
  
  {
    timestamps: { createdAt: true },
    toJSON: { virtuals: true },
  }
);

const CommentSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    content: {
      text: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 2000,
      },
    },
    status: {
      type: Number,
      required: true,
      default: 1,
      enum: [0, 1, 2],
    },
    openToComment: { type: Boolean, default: true },
    answers: { type: [AnswerSchema], default: [] },
     likes: [{ type: ObjectId, ref: "User" }],
  dislikes: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: true },
    toJSON: { virtuals: true },
  }
);

// Virtual for comment author details
CommentSchema.virtual("author", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  options: { select: "name avatar" },
});

// Indexes for better performance
CommentSchema.index({ product: 1, status: 1 });
CommentSchema.index({ createdAt: -1 });

module.exports = {
  CommentModel: mongoose.model("Comment", CommentSchema),
};
