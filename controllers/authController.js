const express = require('express');
const router = express.Router();
const httpStatus = require('../lib/httpStatus');
const jwtModule = require('../lib/jwtModule');
const verifyToken = require('../lib/verifyToken');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/index');

var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var options = {
  auth: {
    api_key:
      process.env.API_KEY
    }
};

var mailer = nodemailer.createTransport(sgTransport(options));




router.post('/login', function(req, res) {
  const {application, email, password} = req.body
  if (!application || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).send({ auth: false, error: 'Invalid parameters in request' });
  }
  User.findOne({ email }, function (error, user) {
    if (error) {
      const message = `Server error: ${error.message}`
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, error: message });
    } else {
      if (user) {
        const {_id, email, password} = user
        const passwordMatch = bcrypt.compareSync(req.body.password, password);
        if (passwordMatch) {
          // sign and return a new token
          const payload = {id: _id}
          const signingOptions = {
            subject: email,
            audience: application
          }
          const signedToken = jwtModule.sign(payload, signingOptions)
          return res.status(httpStatus.OK).send({ auth: true, id:_id, token: signedToken,is_email_notification: user.is_email_notification, is_push_notification: user.is_push_notification, created_at: user.created_at.toString() });
        } else {
          return res.status(httpStatus.UNAUTHORIZED).send({ auth: false, token: null });
        }
      } else {
        const message = `User not found (email: ${req.body.email})`
        return res.status(httpStatus.NOT_FOUND).send({ auth: false, error: message });
      }
    }
  });
});



router.post('/register', function(req, res) {
  console.log(req.body)
  const {application, device, email, name, password, state,phone,age,country, android_device_token,ios_device_token} = req.body
  if (!application || !email || !name || !password) {
    return res.status(httpStatus.BAD_REQUEST).send({ registered: false, error: 'Invalid parameters in request' });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
      name : name,
      email : email,
      password : hashedPassword,
      state,
      phone,
      age,
      country,
      android_device_token,
      ios_device_token,
      device
    },
    function (error, user) {
      if (error) {
        console.log(error.code)
        let message;
        if(error.code === 11000){
          message = `A User with this email Id already exists`
           
        } else {

           message = `Server error: ${error.message}`
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ registered: false, error: message });
      }
      // if user created, return a signed token
      const payload = {id: user._id}
      const options = {subject: email, audience: application}
      const signedToken = jwtModule.sign(payload, options)

      res.status(httpStatus.OK).send({ registered: true, token: signedToken, id: user._id, is_email_notification: user.is_email_notification, is_push_notification: user.is_push_notification, created_at: user.created_at.toString() });
    
      var emailToSend = {
        to: user.email,
        from: "info@fitforgolfusa.com",
        subject: "You have been successfully registered - Synergistic Golf",
        text: "Thank you for registering with us"
      };
  
      // console.log({email})
      mailer.sendMail(emailToSend, function(err, res) {
        if (err) {
          console.log(err);
        }
        console.log({res})
  
    
      });
    });

});

router.get('/me', verifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (error, user) {
    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${error.message}`);
    }
    if (user) {
      res.status(httpStatus.OK).send({id: user.id, email: user.email, name: user.name});
    } else {
      return res.status(httpStatus.NOT_FOUND).send(`User not found (_id: ${req.userId})`);
    }
  });
});

router.get("/test", verifyToken, (req, res) => {
  res.status(200).json({cool})
})

module.exports = router;
