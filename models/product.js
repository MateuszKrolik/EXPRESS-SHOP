const products = [];

module.exports = class Product {
  constructor(t) {
    this.title = t; // this refers to the object created based on this class
  }
  save() {  
    products.push(this); 
  }
  static fetchAll() {
    // static methods can be called directly on the class itself and not on instances of the class
    return products;
  }
};
