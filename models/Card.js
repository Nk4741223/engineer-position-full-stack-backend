const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      maxlength: 10,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Card", cardSchema);
