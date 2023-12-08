const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      maxlength: 20,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      maxlength: 200,
      trim: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Card", cardSchema);
