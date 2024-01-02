const fs = require("fs");
const path = require("path");

// global to avoid p is not defined error
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

// create helper to reuse file storage code
const getProductsFromFile = (cb) => {
  // callback to avoid  'TypeError: Cannot read property 'length' of undefined'
  // static methods can be called directly on the class itself and not on instances of the class
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      // return []; //dont need else because return stops execution of the function
      cb([]); // cb is a callback function
    } else {
      //   return JSON.parse(fileContent);
      cb(JSON.parse(fileContent));
    }
  });
  return products;
};

const products = [];

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    //names dont have to match
    this.title = title; // this refers to the object created based on this class
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  // arrow function ensures that this refers to the class
  // callback refers to anonymous function passed as argument in fetchAll in controllers/products.js
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
