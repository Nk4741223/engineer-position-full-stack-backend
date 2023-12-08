const chai = require("chai");
const chaiHttp = require("chai-http");
const {server} = require("../server");
const Card = require("../models/Card");

chai.use(chaiHttp);
const expect = chai.expect;

describe("CRUD API Tests", () => {
  it("should get all cards", async () => {
    const res = await chai.request(server).get("/api/cards");

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  let cardId;

  it("should creat a new card", async () => {
    const res = await chai
      .request(server)
      .post("/api/cards")
      .send({title: "Test Item", content: "Test Description"});

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");

    cardId = res.body._id;
  });

  it("should get an card", async () => {
    const res = await chai.request(server).get(`/api/cards/${cardId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id").eql(cardId);
  });

  it("should update an card", async () => {
    const res = await chai
      .request(server)
      .put(`/api/cards/${cardId}`)
      .send({title: "Updated Item", content: "Updated Description"});

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("title").eql("Updated Item");
  });

  it("should delete an card", async () => {
    const res = await chai.request(server).delete(`/api/cards/${cardId}`);
    expect(res).to.have.status(200);
    expect(res.body).eql("カードの削除に成功しました");
  });
});

describe("Search Test", () => {
  it("should return cards matching the search query", async () => {
    const testCard = new Card({
      title: "Test Card",
      content: "This is a test card for search functionality",
    });
    await testCard.save();

    const res = await chai
      .request(server)
      .get("/api/cards/search/query")
      .query({q: "Test Car"});

    expect(res).to.have.status(200);
    expect(res.body[0].title).eql("Test Card");
  });
});

describe("DB Validation Test", () => {
  it("should defelult", async () => {
    const card = new Card();
    await card.save();
    expect(card.title).to.equal("");
    expect(card.content).to.equal("");
  });

  it("should length ok", async () => {
    const card = {
      title: "This is a title",
      content: "This is the content of the card.",
    };

    const res = await chai.request(server).post("/api/cards").send(card);
    expect(res).to.have.status(200);
    expect(res.body.title).to.have.length.at.most(20);
    expect(res.body.content).to.have.length.at.most(200);
  });

  it("should length miss", async () => {
    const card = {
      title: "This is a title This is a title",
      content: "This is the content of the card.",
    };

    const res = await chai.request(server).post("/api/cards").send(card);
    expect(res).to.have.status(500);
  });

  it("should trim", async () => {
    const card = new Card({
      title: " Test Card ",
      content: "Test Description ",
    });
    await card.save();

    expect(card.title).to.equal("Test Card");
    expect(card.content).to.equal("Test Description");
  });

  it("should timestamp", async () => {
    const card = new Card();
    await card.save();

    expect(card.updatedAt).to.exist;
  });
});
