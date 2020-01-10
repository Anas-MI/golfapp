const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const HowItWorks = require('../models/HowItWorks');



//Route to create HowItWorks
router.post('/create', (req, res) => {
    console.log(req.body)
    let {content }= req.body;

	let howItWorks = new HowItWorks({
        content	});

        howItWorks
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
	HowItWorks.find({})
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete HowItWorks
router.delete('/delete/:id', (req, res) => {
	
	HowItWorks.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'AboutUs deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single HowItWorks
router.get('/:id', (req, res) => {
	HowItWorks.findById(req.params.id)
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	HowItWorks.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Journal Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to display how it works for the app
router.get("/", (req, res) => {
	HowItWorks.find().then(data => {
		res.status(httpStatus.OK).json({status: true, message:"How it works fetched!", data: data[0]})
	}).catch(err => {
		res.status(httpStatus.BAD_REQUEST).json({status: false, message:err})
	})
})
module.exports = router;