const Sequelize = require("sequelize");
//capitalized because it is a constructor function/class
const sequelize = require("../util/database");
//db connection pool

const Product = sequelize.define("product", {
  //define model
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  //define fields
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}); 

module.exports = Product;