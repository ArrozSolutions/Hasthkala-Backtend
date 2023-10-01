const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const dbConnect = require("./config/db/dbConnect");
const passport = require('passport');

//ROUTES
const userRoutes = require('./route/User/UserRoutes');
const otpRoutes = require('./route/User/OtpRoute');
const categoryRoutes = require('./route/Category/CategoryRoute');
const productRoutes = require('./route/Product/ProductRoutes');
const initialDataRoutes = require('./route/InitialData/InitialDataRoute');
const cartRoutes = require('./route/Cart/CartRoute');
const orderRoutes = require('./route/Order/OrderRoute');
const paymentRoutes = require('./route/Payment/PaymentRoutes');
const adminRoutes = require('./route/Admin/AdminRoutes');
const session = require('express-session');

//dotenv
dotenv.config();
const app = express();

// dbConnect
dbConnect();



app.use(express.json());

//cors
app.use(cors());

//Users route
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", userRoutes);
app.use("/api", otpRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", adminRoutes);

module.exports = app;
