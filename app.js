const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next(); // continue with next middleware
  //   })
  //   .catch((err) => console.log(err));
});

// app.use("/admin", adminRoutes); // order matters when using use() method, but not when using get()
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
