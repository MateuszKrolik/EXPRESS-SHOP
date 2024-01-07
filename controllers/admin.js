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
  const product = new Product(title , price , description , imageUrl);
    //create new product
    product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit === "true";
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   //prepopulate the form with the product info
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then((products) => {
//       //array of products
//       const product = products[0];
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   //   if (!product) {
//   //     return res.redirect("/");
//   //   }
//   //   res.render("admin/edit-product", {
//   //     pageTitle: "Edit Product",
//   //     path: "/admin/edit-product",
//   //     editing: editMode,
//   //     product: product,
//   //   });
//   // });
// };

// exports.postEditProduct = (req, res, next) => {
//   //3 things: fetch info for product, create new product with updated info and call save
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedPrice = req.body.price;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.imageUrl = updatedImageUrl;
//       product.description = updatedDesc;
//       return product.save(); //return to not nest another promise
//     })
//     .then((result) => {
//       //success promise
//       console.log("UPDATED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err));
//   //create new product
//   // const updatedProduct = new Product(
//   //   prodId,
//   //   updatedTitle,
//   //   updatedImageUrl,
//   //   updatedDesc,
//   //   updatedPrice
//   // );
//   // updatedProduct.save();
//   // res.redirect("/admin/products");
// };

// exports.getAdminProducts = (req, res, next) => {
//   // Product.findAll()
//   req.user
//     .getProducts()
//     .then((products) => {
//       console.log(products);
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => console.log(err));
//   //   Product.fetchAll((products) => {
//   //     res.render("admin/products", {
//   //       // .ejs can be omitted
//   //       prods: products,
//   //       pageTitle: "Admin Products",
//   //       path: "/admin/products",
//   //     });
//   //   });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy(); //return to not nest another promise
//     })
//     .then((result) => {
//       //success promise
//       console.log("DESTROYED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err));
// };
