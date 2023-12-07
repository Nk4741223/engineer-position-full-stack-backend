const router = require("express").Router();
const {find} = require("../models/Card");
const Card = require("../models/Card");

//カードを作成する
router.post("/", async (req, res) => {
  try {
    const newCard = await Card.create(req.body);
    return res.status(200).json(newCard);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを全て取得する
router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find({});
    return res.status(200).json(allCards);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを１つ取得する
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを更新する
router.put("/:id", async (req, res) => {
  try {
    const upatedCard = await Card.findOneAndUpdate(
      {_id: req.params.id},
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!upatedCard) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }
    return res.status(200).json(upatedCard);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを削除する
router.delete("/:id", async (req, res) => {
  try {
    const deleteCard = await Card.findOneAndDelete({_id: req.params.id});
    if (!deleteCard) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }
    return res.status(200).json("カードの削除に成功しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
