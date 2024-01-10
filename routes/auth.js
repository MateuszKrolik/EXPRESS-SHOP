const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin); //point @ controller w/ getLogin function

router.post("/login", authController.postLogin); //point @ controller w/ getLogin function

module.exports = router;
