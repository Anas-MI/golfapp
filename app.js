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

module.exports = app;
