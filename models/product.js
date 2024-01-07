const mongodb = require("mongodb");
const getDb = require("../util/database").getDb; //import by accessing getDb

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  //save in db
  save() {
    //manage one connection and return access to mongo
    const db = getDb();
    return db //return to treat as promise
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(this);
      })
      .catch((err) => console.log(err));
  }
  //fetch all products
  static fetchAll() {
    const db = getDb(); //get access to db
    return db
      .collection("products")
      .find()
      .toArray() //returns cursor, toArray for small amount of data, for large amount use pagination
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) }) //mongodb stores id in _id as objects, so need to convert to object in new constructor
      .next() //returns next document in cursor returned by find
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
