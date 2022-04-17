const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const dotenv = require('dotenv');
// get config vars
dotenv.config();

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderDetail = require('./models/order-detail');

// CORS is for cross communication - data sharing
var cors = require('cors');
app.use(cors());

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // changed to this as we will be getting json as post request- above will not work
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user = user;
        next();
    }).catch(err=>console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((req,res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product); // Not required
User.hasOne(Cart);
Cart.belongsTo(User); // Optional
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderDetail });
Product.belongsToMany(Order, { through: OrderDetail });

// Here {force:true} is to be removed when moving to production
// We use it, as product table is already created and after that we are giving above changes to the table,
// so it will not override the new information. But it will delete product records
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    }).then(user => {
        if(!user) {
            return User.create({name: 'Janmejoy Sahoo', email: 'janmejoysahoo007@gmail.com'});
        }
        return user;
    }).then(user => {
        return Cart.findAndCountAll({ where: { userId: user.dataValues.id}}).then(cartCnt=>{
            if(cartCnt.count==0) return user;
        });
    }).then(user =>{
        if (user){
            user.createCart();
        }
        app.listen(3000);
    }).catch(err=>console.log(err));