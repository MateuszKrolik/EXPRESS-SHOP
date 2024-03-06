const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, 
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

//it has to be a regular function, so that 'this' refers to the schema
//methods key is an object that allows to add own methods to schema
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  }); //if it's sth else than -1, then it already exists in cart
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items]; //can now use array methods on it without changing the original cart
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id, //mongoose will automatically wrap it in an object id
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  }; //spread operator to pull out all properties of product, then overwrite its quantity property
  this.cart = updatedCart;
  return this.save(); //to not update manually
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }; //empty cart
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
