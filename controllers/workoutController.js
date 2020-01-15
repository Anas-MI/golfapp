const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Workout = require('../models/Workout');



//Route to create Workout
router.post('/create', (req, res) => {

	let workout = new Workout(req.body);

        workout
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
	Workout.find({})
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete Workout
router.delete('/delete/:id', (req, res) => {
	
	Workout.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'AboutUs deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single Workout
router.get('/:id', (req, res) => {
	Workout.findById(req.params.id)
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Journal Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Change state of is paid 
router.post("/change/:id", (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, {$set:{isPaid: req.body.isPaid}}).then(data => {
        res.status(httpStatus.OK).json({ status: true, message: 'Workout Updated', data });

    }).catch(err => {
        res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });

    })
})


//Validate a workout video
router.post("/validate", (req, res) => {
	
	let {userId, videoId} = req.body
	
	Workout.find({ "subscriptions": { "$in": [userId] },_id: videoId}).then(data => {
		console.log(data.length)
		if(data.length >= 1){
			res.status(200).json({status: true, message:"Subscription found", data})
		} else if(data.length < 1){
			res.status(400).json({status: false, message:"Subscription not found"})
		}
	}).catch(err => {
		res.status(400).json({status: false, message: err})
	})
})

module.exports = router;