const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true'; // Check the 'edit' query parameter
  res.render('admin/edit-product', {
    // .ejs can be omitted
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: editMode,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  // routes can be repeated when using different HTTP methods
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title, //part on right refers to data received from controller action
    price: price, //part on left refers keys defined in product schema
    description: description,
    imageUrl: imageUrl,
    userId: req.user, //mongoose will automatically fetch the user id
  }); //null for id because mongo will create one
  //create new product
  product
    .save() //provided by mongoose
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.redirect('/');
  }
  //prepopulate the form with the product info
  const prodId = req.params.productId;
  Product.findById(prodId) //findById is a mongoose method
    // Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     editing: editMode,
  //     product: product,
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  //3 things: fetch info for product, create new product with updated info and call save
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  // const product = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDesc,
  //   updatedImageUrl,
  //   prodId
  // );
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDesc;
      return product.save();
    })
    .then((result) => {
      //success promise
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
  //create new product
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect("/admin/products");
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") //selects title and price, -id excludes id
    // .populate("userId", "name") //populate userId with name
    .then((products) => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId) //findByIdAndDelete is a mongoose method
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
