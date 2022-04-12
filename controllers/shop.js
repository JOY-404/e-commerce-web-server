const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.status(200).json(products);
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  }).catch(err => res.status(500).json());
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(err=>console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart=>{
    return cart.getProducts().then(products => {
      res.status(200).json(products);
      //   res.render('shop/cart', {
      //     path: '/cart',
      //     pageTitle: 'Your Cart',
      //     products: products
      // });
    }).catch(err => res.status(500).json());
  }).catch(err => res.status(500).json());
};

exports.postCart = (req, res, next) => {
  if (!req.body.productId) {
    return res.status(400).json();
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQty = 1;
  //const prodSize = req.body.prodSize;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } });
  }).then(products => {
    let product;
    if(products.length > 0) {
      product = products[0];
    }
    if(product) {
      // get new quantity
      const oldQty = product.cartItems.quantity;
      newQty = oldQty + 1;
      return product;
    }
    return Product.findByPk(prodId)
  }).then(product => {
    // This will add new record or update old record
    return fetchedCart.addProduct(product, { through: { quantity: newQty } });
  }).then(result=>{
    res.status(200).json();
  }).catch(err => {
    res.status(500).json();
  });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts({where: {id: prodId}});
  }).then(products=>{
    const product = products[0];
    return product.cartItems.destroy();
  }).then(() => res.status(200).json())
    .catch(err => res.status(500).json());
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
