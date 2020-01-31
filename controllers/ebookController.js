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
const ejs = require("ejs");

let isCardError = response => {
  console.log(response);
  if (response.raw.type === "card_error") {
    return true;
  } else {
    return false;
  }
};

//nodemailer
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");


  
  var options = {
      auth: {
        api_key:
        //   "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"
        process.env.API_KEY
        
    }
    };
    var mailer = nodemailer.createTransport(sgTransport(options));


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
        
            let email = {
                to: data.email,
                from: "info@fitforgolfusa.com",
                subject: "Transaction successful! - Synergistic Golf",
    
                text: "Thank you for purchasing an Ebook from us!"
              };
    
              
              mailer.sendMail(email, function(err, res) {
                if (err) {
                  console.log(err);
                }
                console.log({res})})
        
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
                                    
                                        let email = {
                                            to: data.email,
                                            from: "info@fitforgolfusa.com",
                                            subject: "Transaction successful! - Synergistic Golf",
                                
                                            text: "Thank you for purchasing an ebook from us!"
                                          };
                                
                                          
                                          mailer.sendMail(email, function(err, res) {
                                            if (err) {
                                              console.log(err);
                                            }
                                            console.log({res})})
                                    
                                    
                                    }).catch(console.log)
                                } else if(type == "workout"){
                                    console.log("its a workout video")
                                    Workout.findByIdAndUpdate(videoId, {$push:{subscriptions:userId}}).then(data => {
                                        res.status(200).json({status: true, message:"Subscription added", data})
                                        User.findById(userId).then(data => {
                                            let email = {
                                                to: data.email,
                                                from: "info@fitforgolfusa.com",
                                                subject: "Transaction successful! - Synergistic Golf",
                                    
                                                text: "Thank you for purchasing a Video from us!"
                                              };
                                    
                                              
                                              mailer.sendMail(email, function(err, res) {
                                                if (err) {
                                                  console.log(err);
                                                }
                                                console.log({res})})
                                        }).catch(console.log)
                                       
                                    
                                    
                                    
                                    
                                    }).catch(err => {
                                        res.status(400).json({status: false, message: err})
                                    })
                                } else {
                                Shipping.findByIdAndUpdate(shippingId, {$set:{paid: true}}).then(ship => {
                                    User.findById(ship.user).then(async data => {

                                    


                                    let shipTemplate = await ejs.renderFile(
                                        __dirname + "/ship.ejs",
                                        { data: data, ship:ship }
                                      );
                                      var email = {
                                        to: data.email,
                                        from: "info@fitforgolfusa.com",
                                        subject: "Order Summary",
                            
                                        html: shipTemplate
                                      };
                            
                                      console.log({email})
                                      mailer.sendMail(email, function(err, res) {
                                        if (err) {
                                          console.log(err);
                                        }
                                        var emailToMindi = {
                                            to: process.env.SEND_EMAIL_TO,
                                            from: "info@fitforgolfusa.com",
                                            subject: "Order Summary",
                                
                                            html: shipTemplate
                                          };
                                          mailer.sendMail(emailToMindi, function(err, res) {
                                            if (err) {
                                              console.log(err);
                                            }
                                            console.log(res);
                            
                                        })
                            
                                        console.log(res);
                                      });
                                    }).catch(console.log)



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