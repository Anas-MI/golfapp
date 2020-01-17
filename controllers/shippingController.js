const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Shipping = require('../models/Shipping');





//Route to get all 
router.get('/getall', (req, res) => {
	Shipping.find({}).populate("user")
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete Shipping
router.delete('/delete/:id', (req, res) => {
	
	Shipping.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'AboutUs deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single Shipping
router.get('/:id', (req, res) => {
	Shipping.findById(req.params.id).populate("user")
		.then((data) => {
			console.log({data})
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Journal Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});



module.exports = router;