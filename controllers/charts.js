const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const User = require('../models/User');
const Favorites = require('../models/Favorites');
const Shipping = require('../models/Shipping');
const Synergistic = require('../models/Synergistic');
var schedule = require('node-schedule');
const Analytics = require("../models/analytics")

var j = schedule.scheduleJob('0 2 * * *', function(){
    let user, favorites, orders, ebooks, synergistic;
    User.find({ebook: true}).then(data => {
        console.log(data)
        ebooks = data.length;
    }).catch(err => {
        console.log(err)
    })
    User.count().then(count => {
        user = count;
    }).catch(err => {
        console.log(err)
    })
    Favorites.count().then(count => {
        favorites = count;
    }).catch(err => {
        console.log(err)
    })
    Shipping.count().then(count => {
        console.log({count})
        orders =count;
    }).catch(err => {
        console.log(err)
    })
    Synergistic.count().then(count => {
        synergistic = count;
    }).catch(err => {
        console.log(err)
    })
    
    setTimeout(function(){ 
    Analytics.findById("5e21978e3af5b0244c1ab7d1").then(data => {
        let userdata = data.user, favoritesdata= data.favorites, ordersdata= data.orders, ebooksdata = data.ebooks, synergisticdata = data.synergistic;
        Analytics.findByIdAndUpdate("5e21978e3af5b0244c1ab7d1", {$set:{
            oldUser: userdata, 
            oldFavorites: favoritesdata, 
            oldOrders: ordersdata,
            oldEbooks: ebooksdata,
            oldSynergistic: synergisticdata,
            user, favorites, orders, ebooks, synergistic


        }})
    })


     }, 9000);




});


//run this route once to set it up
router.get("/setup", (req, res) => {
   let analytics = new Analytics({
    user: 15, favorites: 12, orders: 17, ebooks: 19, synergistic: 25,
    oldUser: 10, oldFavorites: 10, oldOrders: 10, oldEbooks: 10, oldSynergistic: 10
}) 
analytics.save().then( data => {res.status(200).json({status: true, message: "You are good to go!", data})})
})


router.get("/analytics", (req, res) => {
    let user, favorites, orders, ebooks, synergistic;
    User.find({ebook: true}).then(data => {
        console.log(data)
        ebooks = data.length;
    }).catch(err => {
        console.log(err)
    })
    User.count().then(count => {
        user = count;
    }).catch(err => {
        console.log(err)
    })
    Favorites.count().then(count => {
        favorites = count;
    }).catch(err => {
        console.log(err)
    })
    Shipping.count().then(count => {
        console.log({count})
        orders =count;
    }).catch(err => {
        console.log(err)
    })
    Synergistic.count().then(count => {
        synergistic = count;
    }).catch(err => {
        console.log(err)
    })
    setTimeout(function(){ res.status(200).json({user, favorites, orders, ebooks, synergistic}) }, 5000);
    
})


module.exports = router