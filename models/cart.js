//cart model
const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //analyze cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //add new product or increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; //copy all properties of existing product and add to new js object
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        // save cart back to file
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice; //+productPrice converts string to number
      //save back
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    //get cart
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      //update cart
      const updatedCart = { ...JSON.parse(fileContent) };
      //find out how often product occurs
      const product = updatedCart.products.findIndex((prod) => prod.id === id);
      //find out what qty is
      const productQty = product.qty;
      //update product and total price
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      cart.totalPrice = cart.totalPrice - productPrice * productQty;
      //write back to file
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
};
