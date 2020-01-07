const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Journal = require('../models/Journal');
const JournalFeed = require('../models/JournalFeed');


//Route to create a new question
router.post('/create', (req, res) => {
    console.log(req.body)
    let {question }= req.body;

	let journal = new Journal({
	question
	});

	journal
		.save()
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Success!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get all the posts
router.get('/getall', (req, res) => {
	Journal.find({})
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete a post
router.delete('/delete/:id', (req, res) => {
	
	Journal.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'Journal deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single post
router.get('/:id', (req, res) => {
	Journal.findById(req.params.id)
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	Journal.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Journal Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Journal Feed
router.post("/feed/create", (req, res) => {
    let journalFeed = new JournalFeed(
       req.body 
    )
    
    
    journalFeed.save().then(data => {
        res.status(httpStatus.OK).json({status: true, message:"Feed created", data})
    }).catch(err => {
        res.status(httpStatus.BAD_REQUEST).json({status: false, message:err})
    })
})


module.exports = router;