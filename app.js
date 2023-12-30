const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000); // Express.js internally calls http.createServer() and passes the Express app to it
