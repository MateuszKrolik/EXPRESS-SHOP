const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next(); // Allows the request to continue to the next middleware in line
});

app.use("/add-product", (req, res, next) => {
  console.log("In another middleware");
  res.send("<h1>Hello from Express!</h1>");
});

app.use("/", (req, res, next) => {
  console.log("In another middleware");
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000); // Express.js internally calls http.createServer() and passes the Express app to it
