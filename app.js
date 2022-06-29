
const express = require("express");
const app = express();

app.use(express.json());                           // process JSON data
app.use(express.urlencoded({ extended: true }));   // process trad form data

const {items} = require("./fakeDb");


const { NotFoundError, BadRequestError } = require("./expressError");



app.get("/items", function(req, res) {
  return res.json({ items });
});


app.post("/items", function(req, res) {
  let newItem = { name: req.body.name, price: req.body.price};
  items.push(newItem);
  return res.json({added: newItem});
})

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