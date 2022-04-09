const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user = user;
        next();
    }).catch(err=>console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product); // Not required

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
        return User.create({name: 'Janmejoy', email: 'joy@gmail.com'});
    }
    return user;
}).then(user => {
    app.listen(3000);
}).catch(err=>console.log(err));