const db = require("../util/database");

const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  save() {
    return db.execute(
      //returns a promise that execute yields
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      //? is a placeholder to prevent SQL injection
      [this.title, this.price, this.imageUrl, this.description]
    );
  }
  static deleteById(id) {}
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  static findById(id) {}
};
