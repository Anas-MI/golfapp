const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Shipping = require('../models/Shipping')
const keyPublishable = "pk_test_SVGwjErnIO8bMtXItRF8YkBW";
const keySecret = " sk_test_hoVy16mRDhxHCoNAOAEJYJ4N00pzRH8xK2";
// const StripeModel = require("./stripe.model");
const stripe = require("stripe")(keySecret);
const Workout = require("../models/Workout")
const User = require("../models/User")
let isCardError = response => {
  console.log(response);
  if (response.raw.type === "card_error") {
    return true;
  } else {
    return false;
  }
};

//Save shipping details
router.post("/save/shipping", (req, res) =>{
    console.log(req.body)
    let shipping = new Shipping(req.body)
    
    
    shipping.save().then(data => {
        res.status(200).json({status: true, message:"Shippig details saved", data})
    }).catch(err => {
        res.status(400).json({status: false, message: err})
    })
})


router.get("/validate", (req, res )=> {
    console.log(req.query);
    let {accessToken} = req.query;
    User.findById(accessToken).then(data => {
        if(data.ebook){
            res.status(200).json({status: true, message:"validate: true", data})
        } else {
            res.status(400).json({status: false, message:"validate: false", data})
        }
    }) 
})

router.post("/inapp", (req, res) => {
    console.log({"from inapp ": req.body })
    let {reciept, userId} = req.body;
    User.findByIdAndUpdate(userId, {$push:{reciept},$set:{ ebook: true}}).then(
        data => {
            res.status(200).json({status: true, message:"Success", data})
        }
    ).catch(err => {
        res.status(400).json({status: false, message: err})
    })
})


router.post("/charge", (req, res) => {
console.log(req.body)
console.log(req.body.type)
if(req.body.type === "ebook"){
    console.log("this is a ebook")
}
        let {
            number,
            exp_month,
            exp_year,
            cvc,
            amount,
            shippingId,
            type, 
            userId,
            videoId
        } = req.body;

//          name: 'jbjbjb',
//   cardNumber: '4242424242424242',
//   cvv: '1212',
//   month: '03',
//   year: '2021',
//   amount: '28',
//   shippingId: '5e1c4eb7f4fd241eaea487b8'

        
        let description = "book purchase",
        email = "user@gmail.com";

        stripe.tokens.create(
            {
                card: {
                    number,
                    exp_month,
                    exp_year,
                    cvc
                }
            },
            function(err, token) {
                if (err) {
                    if (isCardError(err)) {
                        res.status(406).json({
                            status: false,
                            message: "Card Error",
                            error: err.raw.message
                        });
                    } else {
                        res.status(400).json({ status: false, message: err });
                    }
                } else if (token) {
                    console.log(token);
                    stripe.charges.create(
                        {
                            amount,
                            currency: "usd",
                            source: token.id,
                            description,
                            receipt_email: email
                        },
                        function(error, charge) {
                            if (error) {
                                res.status(400).json({ status: false, message: error });
                            } else if (charge) {
                                if(type == "ebook"){
                                    console.log("its a ebook ")
                                    User.findByIdAndUpdate(userId, {$set:{ebook:true}}).then(data => {
                                        res.status(200).json({status: true, message:"ebook purchased", data})
                                    }).catch(console.log)
                                } else if(type == "workout"){
                                    console.log("its a workout video")
                                    Workout.findByIdAndUpdate(videoId, {$push:{subscriptions:userId}}).then(data => {
                                        res.status(200).json({status: true, message:"Subscription added", data})
                                    }).catch(err => {
                                        res.status(400).json({status: false, message: err})
                                    })
                                } else {
                                Shipping.findByIdAndUpdate(shippingId, {$set:{paid: true}}).then(ship => {
                                    res.status(200).json({
                                        status: true,
                                        message: "Transaction Successful",
                                        data: charge
                                    });
                                }).catch(err => {
                                    console.log(err)
                                    res.status(400).json({ status: false, message: error });

                                })}


                               
                            }
                        }
                        );
                    }
                }
                );
            ;
            
        })
            module.exports = router;