const Sequelize = require("sequelize");

const sequelize = new Sequelize("express-shop", "root", "express-shop", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize; //db connection pool managed by sequelize
