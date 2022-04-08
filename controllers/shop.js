const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(([product]) => {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(err=>console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData]) => {
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll().then(([products, fieldData]) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductDatas = cart.products.filter(prod => prod.id === product.id);
        if (cartProductDatas) {
          cartProductDatas.forEach(cartProductData => {
            cartProducts.push({ productData: product, size: cartProductData.size, qty: cartProductData.qty });
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    }).catch(err => console.log(err));;
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const prodSize = req.body.prodSize;
  Product.findById(prodId).then(([product]) => {
    Cart.addProduct(prodId, prodSize, product[0].price);
    res.redirect('/cart'); 
  }).catch(err => console.log(err));
}

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
