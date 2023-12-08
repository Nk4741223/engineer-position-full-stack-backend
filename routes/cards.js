const router = require("express").Router();
const Card = require("../models/Card");

const NodeCache = require("node-cache");
const cache = new NodeCache();

//カードを作成する
router.post("/", async (req, res) => {
  try {
    const newCard = await Card.create(req.body);
    cache.del("/");

    return res.status(200).json(newCard);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを全て取得する
router.get("/", async (req, res) => {
  try {
    const cachedCards = cache.get("/");
    if (cachedCards) {
      return res.status(200).json(cachedCards);
    }

    const allCards = await Card.find({});
    cache.set("/", allCards, 300);

    return res.status(200).json(allCards);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを１つ取得する
router.get("/:id", async (req, res) => {
  try {
    const cachedCard = cache.get(req.params.id);
    if (cachedCard) {
      return res.status(200).json(cachedCard);
    }

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }
    cache.set(req.params.id, card, 300);

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
    cache.del("/");
    cache.del(req.params.id);

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
    cache.del("/");
    cache.del(req.params.id);

    return res.status(200).json("カードの削除に成功しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//カードを検索する
router.get("/search/query", async (req, res) => {
  try {
    const query = req.query.q;
    const serchedCards = await Card.find({
      $or: [
        {title: {$regex: new RegExp(query, "i")}},
        {content: {$regex: new RegExp(query, "i")}},
      ],
    });
    cache.del("/");

    return res.status(200).json(serchedCards);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
