const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);

app.listen(3000); // Express.js internally calls http.createServer() and passes the Express app to it
