
const express = require("express");
const app = express();

app.use(express.json());                           // process JSON data
app.use(express.urlencoded({ extended: true }));   // process trad form data

const { items } = require("./fakeDb");


const { NotFoundError, BadRequestError } = require("./expressError");


/** Returns list of items as JSON like:
 *  { items: [{ name, price}, ... ] }
 */

app.get("/items", function (req, res) {

  return res.json({ items });
});


/** Accepts JSON body of new item details, add item to list.
 *  Return JSON: { added: { name, price}, ... } */

app.post("/items", function (req, res) {

  if (!(req.body.name) || !(req.body.price)) {
    throw new BadRequestError("Item must have a name and price.");
  }

  let newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);

  return res.status(201).json({ added: newItem });
});


/** Given a name as URL param, find and return that item.
 *  Return JSON: { name, price }
 *  Throw 404 Error if not found.
 */

app.get("/items/:name", function (req, res) {

  for (let item of items) {

    if (item.name === req.params.name) {

      return res.json(item);
    }
  }
  throw new NotFoundError("Item does not exist.");
});



/** Given a name as URL param, update that item with new price.
 *  Return JSON: { updated: { name, price} }
 *  Throw 404 Error if not found.
 */

app.patch("/items/:name", function (req, res) {

  for (let item of items) {

    if (item.name === req.params.name) {

      item.price = req.body.price;

      return res.json({ updated: item });
    }
  }
  throw new NotFoundError("Item does not exist.");
});


/** Given a name as URL param, delete that item.
 *  Return JSON: {message: "Deleted" }
 *  Throw 404 Error if not found.
 */
 app.delete("/items/:name", function (req, res) {
  const deleteIndex = items.findIndex(item => item.name === req.params.name);

  if (deleteIndex !== -1) {
    items.splice(deleteIndex,1);
    return res.json({ message: "Deleted" });
  }
  throw new NotFoundError("Item does not exist.");
});



/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;