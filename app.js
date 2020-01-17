require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require("morgan");
const httpStatus = require('./lib/httpStatus')
const bodyParser = require('body-parser')



require('./db');
require('dotenv').config()

//Morgan
app.use(morgan('dev'));

//Cors stuff
app.use(cors({ origin: process.env.CLIENT_URL }));

console.log({"Your access control header origin :": process.env.CLIENT_URL})
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.get('/api/v1', function (req, res) {
  res.status(httpStatus.OK).send('API v1 running');
});

const userController = require('controllers/userController');
app.use('/api/v1/users', userController);

const authController = require('controllers/authController');
app.use('/api/v1/authentication', authController);

const synergisticController = require('./controllers/synergisticController')
app.use('/api/v1/synergistic', synergisticController)

const journalController = require('./controllers/journalController')
app.use('/api/v1/journal', journalController)

const favoritesController = require('./controllers/favoritesController')
app.use('/api/v1/favorites', favoritesController)


const aboutUsController = require('./controllers/aboutUs')
app.use('/api/v1/aboutus', aboutUsController)

const howItWorksController = require("./controllers/howItWorks")
app.use("/api/v1/howitworks", howItWorksController)

const WorkoutController = require("./controllers/workoutController")
app.use("/api/v1/Workout", WorkoutController)

const PaypalController = require('./controllers/paypalcontroller')
app.use("/api/v1/paypal", PaypalController)

const ebookController = require("./controllers/ebookController")
app.use("/api/v1/ebook", ebookController)

const shippingController = require("./controllers/shippingController")
app.use("/api/v1/ship", shippingController)

const chartcontroller = require("./controllers/charts")
app.use("/api/v1/chart", chartcontroller)

module.exports = app;
