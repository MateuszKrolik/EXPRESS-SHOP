const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //require returns a function that i need to pass session to
const errorController = require("./controllers/error");
const User = require("./models/user");

MONGODB_URI =
  "mongodb+srv://mateuszkrolik87:1I9UbNZqMksVzkNk@cluster0.gdjmk4f.mongodb.net/shop"; //removed retryWrites to avoid error

const app = express();
const store = new MongoDBStore({
  //mongodbstore yields a constructor that i need to instantiate
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    //if user is not logged in
    return next(); //continue with next middleware
  }
  User.findById(req.session.user._id) //to not hardcode user id
    .then((user) => {
      req.user = user; //mongoose model
      next(); //instead of redirecting like in auth.js
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);
app.use(authRoutes); //everything that doesnt go to admin or shop will go to auth

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
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
