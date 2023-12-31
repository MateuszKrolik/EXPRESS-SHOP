const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000); // Express.js internally calls http.createServer() and passes the Express app to it
