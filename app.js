const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret:'my secret', resave: false, saveUninitialized: false,}));

app.use((req, res, next) => {
  User.findById("659d8089f0009dc0172b9c3c")
    .then((user) => {
      req.user = user; //mongoose model
      next(); // continue with next middleware
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);
app.use(authRoutes); //everything that doesnt go to admin or shop will go to auth

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://mateuszkrolik87:1I9UbNZqMksVzkNk@cluster0.gdjmk4f.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Mateusz",
          email: "test@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
