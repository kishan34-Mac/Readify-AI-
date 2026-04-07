const mongoose = require("mongoose");

const readmeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    sourceType: {
      type: String,
      enum: ["folder", "repo", "user"],
      required: true,
    },
    sourceLabel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Readme", readmeSchema);
