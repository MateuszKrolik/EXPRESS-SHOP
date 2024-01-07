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
    db.collection("products")
      .inserOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
