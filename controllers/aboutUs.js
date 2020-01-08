const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const AboutUs = require('../models/AboutUs');



//Route to create about us
router.post('/create', (req, res) => {
    console.log(req.body)
    let {content }= req.body;

	let aboutUs = new AboutUs({
        content	});

	aboutUs
		.save()
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Success!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get all 
router.get('/getall', (req, res) => {
	AboutUs.find({})
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete AboutUs
router.delete('/delete/:id', (req, res) => {
	
	AboutUs.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'AboutUs deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single AboutUs
router.get('/:id', (req, res) => {
	AboutUs.findById(req.params.id)
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	AboutUs.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Journal Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});



module.exports = router;