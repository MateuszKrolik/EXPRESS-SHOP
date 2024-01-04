const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // const products = Product.fetchAll();
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      // .ejs can be omitted
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log(prodId); //cant log asynch func
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  //fetch all products and return to cart
  Cart.getCart((cart) => {
    //get info about products in cart
    Product.fetchAll((products) => {
      const cartProducts = [];
      //filter products in cart
      for (let product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        // .ejs can be omitted
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts, //return and send to view
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  //get product and add to cart
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  //remove product from cart not product itself
  const prodId = req.body.productId;
  //get price of product to be deleted
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    // .ejs can be omitted
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    // .ejs can be omitted
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
