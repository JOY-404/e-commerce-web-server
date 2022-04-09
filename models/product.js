const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;





// const db = require('../util/database'); 
// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     if(this.id) {
//       return db.execute(`UPDATE products SET title='${this.title}', price=${this.price}, 
//         imageUrl='${this.imageUrl}', description='${this.description}' WHERE id=${this.id}`);
//     }
//     else {
//       return db.execute(`INSERT INTO products (title,price,imageUrl,description) 
//         VALUES ('${this.title}', ${this.price}, '${this.imageUrl}', '${this.description}')`);
//     }
//   }

//   static deleteproductbyID(id) {
//     return db.execute(`DELETE FROM products WHERE id=${id}`);
//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//     return db.execute(`SELECT * FROM products WHERE id=${id}`);
//     // return db.execute('SELECT * FROM products WHERE id=?', id); // Another way
//   }
// };
