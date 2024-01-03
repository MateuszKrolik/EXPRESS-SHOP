const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  const editMode = req.query.edit === "true"; // Check the 'edit' query parameter
  res.render("admin/edit-product", {
    // .ejs can be omitted
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: editMode,
  });
};

exports.postAddProduct = (req, res, next) => {
  // routes can be repeated when using different HTTP methods
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price); //same order as constructor
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true";
  if (!editMode) {
    return res.redirect("/");
  }
  //prepopulate the form with the product info
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    //callback if product retrieved
    //assuming always get a product
    res.render("admin/edit-product", {
      // .ejs can be omitted
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      // .ejs can be omitted
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
