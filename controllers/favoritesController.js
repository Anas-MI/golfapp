const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Favorites = require('../models/Favorites');



//Route to add synergy to favorites
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

//Route to get all favorites
router.get('/getall', (req, res) => {
	Favorites.find({}).populate("user").populate("synergistic")
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to remove id from favorite
router.delete('/delete/:id', (req, res) => {
	
	Favorites.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'Favorites deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single favorite
router.get('/:id', (req, res) => {
	Favorites.findById(req.params.id).populate("user").populate("synergistic")
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a favorite
router.post('/update/:id', (req, res) => {
	Favorites.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Favorites Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});



module.exports = router;