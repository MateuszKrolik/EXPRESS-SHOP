const Product = require("../models/product");
//dont need to require Cart/Oder as i dont access it directly

exports.getProducts = (req, res, next) => {
  Product.find() //fetch all products,turn to cursor for large amount of data(pageination)
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log(prodId); //cant log asynch func
  // Product.findAll({ where: { id: prodId } })
  //   .then((products) => {
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // };
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  //use cart and get all products associated w/ user and render them to screen
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};
// add product to cart in next commit

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product); //return result of updateOne, which is a promise
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  //remove product from cart not product itself
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId) //deleteItemFromCart is a method i created in user model
    // .then((cart) => {
    //   return cart.getProducts({ where: { id: prodId } });
    // })
    // .then((products) => {
    //   const product = products[0];
    //   return product.cartItem.destroy(); //magic method to remove from in between table
    // })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  //get price of product to be deleted
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder() //addOrder is a method i created in user model
    // .getCart()
    // .then((cart) => {
    //   fetchedCart = cart; //store cart in variable to use in next then block
    //   return cart.getProducts();
    // })
    // .then((products) => {
    //   return req.user
    //     .createOrder()
    //     .then((order) => {
    //       return order.addProducts(
    //         products.map((product) => {
    //           product.orderItem = { quantity: product.cartItem.quantity };
    //           return product;
    //         })
    //       );
    //     })
    //     .catch((err) => console.log(err));
    // })
    // .then((result) => {
    //   return fetchedCart.setProducts(null);
    // })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//   });
// };
