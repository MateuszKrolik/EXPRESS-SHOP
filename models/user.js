const Sequelize = require("sequelize");
//capitalized because it is a constructor function/class
const sequelize = require("../util/database");
//db connection pool

//define user model with an id, name and email
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  //define fields
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
