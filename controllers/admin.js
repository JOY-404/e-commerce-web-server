const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // This will immediately save it to database
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   userId: req.user.id // We can do it another way
  // })
  req.user.createProduct({ //this function is given by sequelize when we assign association in app.js
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result => {
    //console.log(result)
    console.log('Created Product');
    res.redirect('/');
  }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId;
  // If we want to get products for respective user 
  //Product.findByPk(prodId)
  req.user.getProducts({where: {id: prodId}})
    .then((products) => {
      const product = products[0];
    if (!product) return res.redirect('/');

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err=>console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.findByPk(prodId).then(product => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  }).then(resp=>{
    console.log('Updated');
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req,res,next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    return product.destroy();
  }).then(resp=>{
    console.log('Deleted');
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  //Product.findAll()
  req.user.getProducts()
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err)); 
};
