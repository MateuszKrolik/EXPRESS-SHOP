const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
  //define model
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  //define fields
});

module.exports = Cart;
