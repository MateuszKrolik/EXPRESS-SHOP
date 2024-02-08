const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin); //point @ controller w/ getLogin function

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin); //point @ controller w/ getLogin function

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
