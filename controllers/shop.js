const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const sequelize = require('../util/database');
const ITEMS_PER_PAGE = 3;
const CART_ITEMS_PER_PAGE = 2;

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
  const page = parseInt(req.query.page) || 1;
  let totItems;
  let qryResult;
  
  req.user.getCart().then(async cart => {
    //console.log(cart.dataValues.id);
    const qry = `SELECT CASE WHEN ISNULL(COUNT(p.id)) THEN 0 ELSE COUNT(p.id) END AS cnt,
      CASE WHEN ISNULL(SUM(quantity)) THEN 0 ELSE SUM(quantity) END AS totQty, 
      CASE WHEN ISNULL(SUM(quantity * price)) THEN 0 ELSE SUM(quantity * price) END AS totAmt 
      FROM \`node-connect\`.cartitems as c INNER JOIN \`node-connect\`.products as p ON p.id=c.productId 
      WHERE c.cartId=${cart.dataValues.id}`;
    
      qryResult = await sequelize.query(qry);
    //console.log(qryResult[0][0]);
    return req.user.getCart().then(cart => cart.getProducts({
      limit: CART_ITEMS_PER_PAGE,
      offset: (page - 1) * CART_ITEMS_PER_PAGE
    })).catch(err => res.status(500).json());
  }).then(products => {
    totItems = qryResult[0][0].cnt;
    res.status(200).json({
      products: products,
      currPage: page,
      hasNextPage: page * CART_ITEMS_PER_PAGE < totItems,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totItems / CART_ITEMS_PER_PAGE),
      cartTotQty: qryResult[0][0].totQty,
      cartTotPrice: qryResult[0][0].totAmt
    });
      //   res.render('shop/cart', {
      //     path: '/cart',
      //     pageTitle: 'Your Cart',
      //     products: products
      // });
  }).catch (err => res.status(500).json());
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

exports.postCreateOrder = (req, res, next) => {
  const totAmt = req.body.totAmt;
  const orderDate = new Date();
  let cartProducts;

  req.user.getCart().then(cart => {
    cart.getProducts().then(cartItems => {
      cartProducts = cartItems;
      if (cartItems.length > 0) {
        req.user.createOrder({
          orderDate: orderDate,
          totalAmt: totAmt
        }).then(order => {
          cartProducts.forEach(cartItem => {
            const productId = cartItem.dataValues.id;
            const quantity = parseInt(cartItem.dataValues.cartItems.quantity);
            const totAmt = parseFloat(cartItem.dataValues.price) * quantity;
            // Delete cart item
            cartItem.cartItems.destroy();
            // add order item
            Product.findByPk(productId).then(product => {
              order.addProduct(product, {
                through: {
                  quantity: quantity,
                  totalAmt: totAmt
                }
              });
            }).catch(err => res.status(500).json({ success: false }));
          });

          res.status(200).json({
            orderid: order.dataValues.id,
            success: true
          });
        }).catch(err => res.status(500).json({ success: false }));
      }
      else {
        res.status(400).json({ success: false });
      }
    });
  });
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
