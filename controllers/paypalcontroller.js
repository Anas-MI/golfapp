// import the required packages 

var express = require('express'); 
var path = require('path'); 
var app = express(); 
var paypal = require('paypal-rest-sdk');
const router = express.Router();
const User = require("../models/User")
const Workout = require("../models/Workout")
const ejs = require("ejs");

//nodemailer
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");

const Shipping = require("../models/Shipping")

paypal.configure({
  'mode':  process.env.MODE, //Change this to live 
  'host':  process.env.HOST,
  'client_id':  process.env.CLIENT_ID,
  'client_secret':  process.env.CLIENT_SECRET 
});

var options = {
    auth: {
      api_key:
        // "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"
        process.env.API_KEY
    }
  };
  var mailer = nodemailer.createTransport(sgTransport(options));

router.get("/get", (req, res) => {

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
     
     
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
        }
    });


})

// start payment process  FOR ANDROIDDDDDDDDDD
router.post('/buy/ebook' , ( req , res ) => {
    console.log(req.body)
    let {id}= req.body;
	// create payment object 
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		// "return_url": process.env.CLIENTURL + "/checkout",
        // "cancel_url": process.env.CLIENTURL + "/checkout/error"
        "return_url":   "http://18.219.46.56/success?userid=" + id +"&type=ebook",
		"cancel_url":  "http://18.219.46.56/cancel"
	},
	"transactions": [{
		"amount": {
			"total": req.body.amount,
			"currency": "USD"
		},
		"description": "sdfd"
	}]
    }
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            console.log(transaction)
            var id = transaction.id; 
            // Shipping.findByIdAndUpdate(req.body.shippingId, {$set:{payId:id}}).catch(console.log)

            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    // return res.redirect( links[counter].href )
                    return res.send( JSON.stringify({
                        success: true,
                        url: links[counter].href
                    }) )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.json({status: false, error: err})
        });
})
; 

// start payment process  FOR ANDROIDDDDDDDDDD
router.post('/buy/workout' , ( req , res ) => {
    console.log(req.body)
    let { videoId, id} = req.body;
    let url = `http://18.219.46.56/success?type=workout&videoid=`+ videoId + '&userid=' + id;
	// create payment object 
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		// "return_url": process.env.CLIENTURL + "/checkout",
        // "cancel_url": process.env.CLIENTURL + "/checkout/error"
        // "return_url":   "http://18.219.46.56/success",
        // "cancel_url":  "http://18.219.46.56/cancel"
        "return_url":   url,
		"cancel_url":  "http://18.219.46.56/cancel"
	},
	"transactions": [{
		"amount": {
			"total": req.body.amount,
			"currency": "USD"
		},
		"description": "sdfd"
	}]
    }
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            console.log(transaction)
            var id = transaction.id; 
            // User.findByIdAndUpdate(req.body.id, {$set:{ebook:true}}).catch(console.log)
            // Shipping.findByIdAndUpdate(req.body.shippingId, {$set:{payId:id}}).catch(console.log)
           
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    // return res.redirect( links[counter].href )
                    return res.send( JSON.stringify({
                        success: true,
                        url: links[counter].href
                    }) )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.json({status: false, error: err})
        });
})
;

// start payment process 
router.post('/buy' , ( req , res ) => {
    console.log(req.body)
	// create payment object 
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		// "return_url": process.env.CLIENTURL + "/checkout",
        // "cancel_url": process.env.CLIENTURL + "/checkout/error"
        "return_url":   "http://18.219.46.56/success",
		"cancel_url":  "http://18.219.46.56/cancel"
	},
	"transactions": [{
		"amount": {
			"total": req.body.amount,
			"currency": "USD"
		},
		"description": "sdfd"
	}]
    }
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            console.log(transaction)
            var id = transaction.id; 
            User.findByIdAndUpdate(req.body.userId, {$set:{payId:id}}).catch(console.log)
            Shipping.findByIdAndUpdate(req.body.shippingId, {$set:{payId:id}}).catch(console.log)

            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    // return res.redirect( links[counter].href )
                    return res.send( JSON.stringify({
                        success: true,
                        url: links[counter].href
                    }) )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.json({status: false, error: err})
        });
})
; 

router.post('/successworkout' , (req ,res ) => {

    //this will be returned from the app
    // paymentId,
    //     token,
    //     PayerID

    console.log(req.body); 
    Workout.findByIdAndUpdate(req.body.videoId, {$push:{subscriptions:req.body.userId}}).then(data => {
        res.status(200).json({status: true, message:"Subscription added", data})
        User.findById(req.body.userId).then(data => {
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
        })

    }).catch(err => {
        res.status(400).json({status: false, message: err})
    })
})

router.post('/successebook' , (req ,res ) => {
    console.log(req.body); 
    //this will be returned from the app
    // paymentId,
    //     token,
    //     PayerID
    User.findByIdAndUpdate(req.body.id, {$set:{ebook:true}}).then(data => {
        res.status(200).json({status: true, message:"ebook purchases", data})

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


    }).catch(console.log)


 
})

// success page 
router.post('/success' , (req ,res ) => {

    //this will be returned from the app
    // paymentId,
    //     token,
    //     PayerID

    console.log(req.body); 
    Shipping.findOneAndUpdate({payId: req.body.paymentId}, {$set:{paid:true}}).then(async ship => {
        User.findByIdAndUpdate(ship.user, {$set:{book: true, transactionIdBook: req.body.PayerID}}, {new: true}).then(async data => {
console.log({ship})


        
       console.log({data})
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
       
       
        res.status(200).json({status: true, message:"Success", data})
        console.log({data})
    }).catch(err => {
        console.log(er)
        res.status(400).json({status: false, message:err})
    })

})

// error page 
router.get('/error' , (req , res) => {
    console.log(req.query); 
    // res.redirect('/err.html');
    res.json({status:false}) 
})





// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}					
					

module.exports = router;