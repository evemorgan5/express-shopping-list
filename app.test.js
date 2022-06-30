const request = require("supertest");

const app = require("./app");

let { items } = require("./fakeDb");

let chocolate = { name: "Chocolate", price: 2.5 };

beforeEach(function () {
  items.push(chocolate);
});

afterEach(function () {
  items = [];
});



describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: items });
    expect(resp.statusCode).toEqual(200);
  });

});


describe("POST /items", function () {
  it("Creates a new item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Pear", price: 3.5
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: { name: "Pear", price: 3.5 }
    });
  });

  it("Returns error if new item doesn't have correct parameters", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Pear"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual(
      "Item must have a name and price."
    );
  });
});


