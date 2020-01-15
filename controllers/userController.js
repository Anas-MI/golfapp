const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const User = require('../models/User');

router.post('/', function (req, res) {
  User.create({
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    },
    function (err, user) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
      res.status(httpStatus.OK).send(user);
    });
});

router.get('/', function (req, res) {
 
  User.find({}, function (err, users) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).send(users);
  }).select('-password -__v').sort({name: 1});
});

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    if (!user) return res.status(httpStatus.NOT_FOUND).send('User not found');
    res.status(httpStatus.OK).send(user);
  }).select('-password -__v');
});

router.delete('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.OK).json({status: true, message:"User: "+ user.name +" was deleted."});
  });
});

router.put('/:id', function (req, res) {
  User.findByIdAndUpdate(req.params.id, {
    $set: { email: req.body.email, name: req.body.name }}, {new:false}, function (err, user) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
    res.status(httpStatus.NO_CONTENT).send(user);
  });
});

//Route to update user details
router.post("/update", (req, res) => {
  const { id} = req.body;
  User.findByIdAndUpdate(id, req.body, {new: true}).then(data => {
    return res.status(httpStatus.OK).json({status: true, message: "User Details Updated", data})
  }).catch(
    err => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:`Server error: ${err.message}`});
    }
  )
})

//Route to delete user model
router.post("/delete", (req, res) =>{
  const {id} = req.body;
  User.findByIdAndRemove(id).then(data => {
    return res.status(httpStatus.OK).json({status: true, message: "User Deleted", data})
  }).catch(err => {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:`Server error: ${err.message}`});
  })	
})

//Route for the app to update the user settings
router.post("/settings", (req, res) => {
  let {accessToken,
  isEmailNotification,
  isPushNotification} = req.body;

  User.findByIdAndUpdate(accessToken, {$set:{
    is_email_notification:isEmailNotification,
    is_push_notification:isPushNotification
  }}).then(data => {
    res.status(200).json({status: true, message:"Settings saved!", data})
  }).catch(err => {
    res.status(400).json({status: false, message: err})
  })

})

module.exports = router;
