const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  // Methods
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  //add to cart
  addToCart(product) {
    // const cartProducts = this.cart.items.findIndex(cp => {
    //   return cp._id === product._id;
    // });
    const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }],
    }; //spread operator to pull out all properties of product, then overwrite its quantity property
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      ); //overwrite cart with updatedCart
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
