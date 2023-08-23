const express = require('express');
const bodyParser = require('body-parser');
// route
const userRoute = require('./src/routes/route-user');
const productRoute = require('./src/routes/route-product');
const wishlistRoute = require('./src/routes/route-wishlist');
const cartRoute = require('./src/routes/route-cart');
const orderRoute = require('./src/routes/route-order');
// route
const FileUpload =  require("express-fileupload");
const path = require('path');
const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(FileUpload());
app.use(express.static(path.join(__dirname, 'src/public')))
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/wishlist', wishlistRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);

app.listen(8080, ()=>{
    console.log('Server Berjalan di Port : 8080');
});