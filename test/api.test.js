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
