const express = require("express");
const {default: mongoose} = require("mongoose");
const app = express();
const cardRouter = require("./routes/cards");
require("dotenv").config();

const PORT = 5000;

//データベース接続
mongoose
  .connect(process.env.MONGO_URL)
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
  res.status(200).json("home express");
});

const server = app.listen(PORT, () => {
  console.log("サーバーが起動しました");
});

module.exports = {server};
