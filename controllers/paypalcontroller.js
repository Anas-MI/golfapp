// import the required packages 

var express = require('express'); 
var path = require('path'); 
var app = express(); 
var paypal = require('paypal-rest-sdk');
const router = express.Router();
const User = require("../models/User")
const Shipping = require("../models/Shipping")

paypal.configure({
  'mode': 'sandbox', //Change this to live 
  'host': 'api.sandbox.paypal.com',
  'client_id': 'AUC6qv21q0FeTi0Wqo2p6BVBrFumkA6te3RbBNrmpxpgnuMn-oWAZQtB-CpXy6ZOoDSYxKiwEwBhi3tT',
  'client_secret': 'EEcdrIwBiLseZwYgUqbe2aYTxbPi-KuZSpHfa0UTBr04tjMD2qZNHWCo71cQI0K49MdXvt_OWE1ZspIF' 
});


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
        "return_url":   "http://localhost:3000/success",
		"cancel_url":  "http://localhost:3000/cancel"
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


// success page 
router.post('/success' , (req ,res ) => {

    //this will be returned from the app
    // paymentId,
    //     token,
    //     PayerID

    console.log(req.body); 
    User.findOneAndUpdate({payId: req.body.paymentId}, {$set:{book: true, transactionIdBook: req.body.PayerID}}).then(data => {
        Shipping.findOneAndUpdate({payId: req.body.paymentId}, {$set:{paid:true}}).catch(console.log)
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