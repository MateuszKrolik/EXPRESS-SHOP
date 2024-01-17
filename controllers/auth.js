const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"), //access key for msg
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }) //mongoose method
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        //if user doesnt exist
        return res.redirect("/login");
      }
      //validate password
      bcrypt
        .compare(password, user.password) //returns a promise
        .then((doMatch) => {
          if (doMatch) {
            //if passwords match
            req.session.isLoggedIn = true;
            req.session.user = user; //mongoose model
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          //if passwords dont match
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
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
