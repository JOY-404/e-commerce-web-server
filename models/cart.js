const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, prodSize, productPrice) {
        // Fetch previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id && prod.size === prodSize);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else {
                updatedProduct = { id: id, size: prodSize, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice; // done to store productPrice as int and not as string

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }
}