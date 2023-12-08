const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cardRouter = require("./routes/cards");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

//CROS対策
const cors = require("cors");
app.use(cors());

//データベース接続
mongoose
  .connect(process.env.MONGO_HEROKU_URL || process.env.MONGO_URL)
  .then(() => {
    console.log("DBと接続中・・・");
  })
  .catch((err) => {
    console.log(err);
  });

//ミドルウェア
app.use(express.json());
app.use("/api/cards", cardRouter);

//表示を確認
app.get("/", (req, res) => {
  try {
    res.status(200).json("home express");
  } catch (err) {
    return res.status(500).json(err);
  }
});

const server = app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});

module.exports = {server};
