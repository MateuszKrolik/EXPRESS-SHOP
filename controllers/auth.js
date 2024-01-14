const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("659d8089f0009dc0172b9c3c")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user; //mongoose model
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      //userDoc is mongoose model/document
      if (userDoc) {
        return res.redirect("/signup");
      }
      //hashing is async, so returns a promise
      return bcrypt //12 is the number of rounds/salt value
        .hashSync(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            //use bcryptjs to hash password
            password: hashedPassword,
            cart: { items: [] },
          });
          //save user
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
