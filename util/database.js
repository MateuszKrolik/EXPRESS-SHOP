const mysql = require("mysql2");

//set up connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "express-shop",
  password: "password",
});

//promises instead of callbacks
module.exports = pool.promise();
