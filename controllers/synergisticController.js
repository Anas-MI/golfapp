const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Synergistic = require('../models/Synergistic');


//Route to create new posts
router.post('/create', (req, res) => {
	let name,
		goal,
		explanation,
		nutritionTip,
		thoughts,
		thinkGolf,
		makeMeSmile,
		week,
		day = req.body;

	let synergistic = new Synergistic({
		name,
		goal,
		explanation,
		nutritionTip,
		thoughts,
		thinkGolf,
		makeMeSmile,
		week,
		day
	});

	synergistic
		.save()
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Success!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get all the posts
router.get("/getall", (req, res) => {
    Synergistic.find({}).then(data => {
        res.status(httpStatus.OK).json({status: true, message:"Data fetched!", data})
    }).catch(err => {
        res.status(httpStatus.BAD_REQUEST).json({status: false, message: err})
    })
})

//Route to delete a post


