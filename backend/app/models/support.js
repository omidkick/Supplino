const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const SupportMessageSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  category: {
    type: String,
    enum: ["technical", "billing", "general", "feature_request", "bug"],
    default: "general",
  },
  messages: [
    {
      user: { type: ObjectId, ref: "User", required: true },
      message: { type: String, required: true, maxlength: 2000 },
      isAdmin: { type: Boolean, default: false },
      isReadByUser: { type: Boolean, default: false },   
      isReadByAdmin: { type: Boolean, default: false },  
      createdAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

SupportMessageSchema.index({ user: 1, createdAt: -1 });
SupportMessageSchema.index({ status: 1 });
SupportMessageSchema.index({ priority: 1 });

module.exports = {
  SupportModel: mongoose.model("Support", SupportMessageSchema),
};
