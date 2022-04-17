const Cart = require('../models/cart');
const Product = require('../models/product');
const CartItem = require('../models/cart-item');
const OrderDetail = require('../models/order-detail');
const ITEMS_PER_PAGE = 6;

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
    console.log('Created Product');
    res.status(200).json();
  }).catch(err => res.status(500).json({ error: err }));
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
    .then((products) => res.status(200).json(products[0]))
    .catch(err => res.status(500).json({ error: err }));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  req.user.getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0];
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.status(200).json();
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.postDeleteProduct = (req,res,next) => {
  const prodId = req.params.productId;

  OrderDetail.findAndCountAll({ where: { productId: prodId }})
    .then(prodCnt => {
      if(prodCnt.count > 0) {
        // dependency exists - don't delete
        res.status(200).json({ success: false, msg: "D" });
      }
      else {
        req.user.getProducts({ where: { id: prodId } })
          .then(products => {
            return products[0].destroy();
          })
          .then(resp => {
            return CartItem.findAll({ where: { productId: prodId } });
          })
          .then(cartProducts => {
            cartProducts.forEach(cartProduct => cartProduct.destroy());
            res.status(200).json({ success: true, msg: "S" });
          })
          .catch(err => res.status(200).json({ success: false, msg: err }));
      }
    })
    .catch(err => res.status(200).json({ success: false, msg: err }));
};

exports.getProducts = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;

  Product.findAndCountAll().then(numProducts => {
    totalItems = numProducts.count;
    return Product.findAll({ limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE })
  }).then((products) => {
    res.status(200).json({
      products: products,
      currPage: page,
      hasNextPage: page * ITEMS_PER_PAGE < totalItems,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  }).catch(err => res.status(500).json());
};