const fs = require("fs");
const path = require("path");

const products = [];

module.exports = class Product {
  constructor(t) {
    this.title = t; // this refers to the object created based on this class
  }
  save() {
    // products.push(this);
    const p = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
      // arrow function ensures that this refers to the class
      //   console.log(err);
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  // callback refers to anonymous function passed as argument in fetchAll in controllers/products.js
  static fetchAll(cb) {
    // callback to avoid  'TypeError: Cannot read property 'length' of undefined'
    const p = path.join(
      // to avoid p is not defined error
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    // static methods can be called directly on the class itself and not on instances of the class
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // return []; //dont need else because return stops execution of the function
        cb([]); // cb is a callback function
      }
      //   return JSON.parse(fileContent);
      cb(JSON.parse(fileContent));
    });
    return products;
  }
};
