const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Favorites = require('../models/Favorites');



//Route to create a new question
router.post('/create', (req, res) => {
 

	let favorites = new Favorites(
	req.body
	);

	favorites
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
	Favorites.find({}).populate("user").populate("synergistic")
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete a post
router.delete('/delete/:id', (req, res) => {
	
	Favorites.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'Favorites deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single post
router.get('/:id', (req, res) => {
	Favorites.findById(req.params.id).populate("user").populate("synergistic")
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	Favorites.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Favorites Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

// //Journal Feed
// router.post("/feed/create", (req, res) => {
//     let journalFeed = new JournalFeed(
//        req.body 
//     )
    
    
//     journalFeed.save().then(data => {
//         res.status(httpStatus.OK).json({status: true, message:"Feed created", data})
//     }).catch(err => {
//         res.status(httpStatus.BAD_REQUEST).json({status: false, message:err})
//     })
// })


// //Route to get all the journal feeds
// router.get("/feed/getall", (req, res) => {
//     JournalFeed.find({}).populate("user").populate("questionId").then(data => {
//         res.status(httpStatus.OK).json({status: true, message:"Data fetched!", data})
//     }).catch(err => {
//         res.status(httpStatus.BAD_REQUEST).json({status: false, message: err})
//     })
// })


module.exports = router;