const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Synergistic = require('../models/Synergistic');
const moment = require("moment");
//Route to create new posts
router.post('/create', (req, res) => {
    console.log(req.body)
    let {name,
		goal,
		explanation,
		nutritionTip,
		thoughts,
		thinkGolf,
		makeMeSmile,
		week,
		day }= req.body;

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
router.get('/getall', (req, res) => {
	Synergistic.find({})
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to delete a post
router.delete('/delete/:id', (req, res) => {
	console.log("here")
	Synergistic.findByIdAndRemove(req.params.id)
		.then((data) => {
		
			res.status(200).json({ status: true, message: 'Post deleted' });
		})
		.catch((err) => {
			
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route to get a single post
router.get('/:id', (req, res) => {
	Synergistic.findById(req.params.id)
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Data fetched!', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Route tp Update a post
router.post('/update/:id', (req, res) => {
	Synergistic.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((data) => {
			res.status(httpStatus.OK).json({ status: true, message: 'Post Updated', data });
		})
		.catch((err) => {
			res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err });
		});
});

//Getting the number of weeks/date passed from date 
router.get("/get/synergy", (req, res) => {

	// let {passedDate} = req.body;
	// let passedDate2 = moment("01/01/2020")
	// // let passedDate = moment(new Date()).format("MM/DD/YYYY").toString()
	// console.log(passedDate2)
	// let passedDate = moment("01/21/2020")
	
	// let weeks, days;
	// Date.getFormattedDateDiff = function(date1, date2) {
	// 	var b = moment(date1),
	// 		a = moment(date2),
	// 		intervals = ['years','months','weeks','days'],
	// 		out = [];
	// 	for(var i=0; i<intervals.length; i++){
	// 		var diff = a.diff(b, intervals[i]);
	// 		b.add(diff, intervals[i]);
    //   if(intervals[i] === "weeks"){
    //   weeks = diff
    //   }
    //   if(intervals[i] === "days"){
    //   days = diff
    //   }
	// 		out.push(diff + ' ' + intervals[i]);
	// 	}
	// 	return out.join(', ');
	//   };
	  
	//   Date.getFormattedDateDiff(passedDate, passedDate2)
	//   console.log({weeks, days})
	var aPastDate = moment().subtract(5,'months');
var aPastDay = moment().subtract(6,'days');
var now = moment();
let passedDate = moment("01/01/2019")
moment.fn.durationInWeeks = function(fromDate, toDate) {

    var days    = toDate.diff(fromDate, 'days');    
    var weeks   = toDate.diff(fromDate, 'weeks');
	console.log({days})
	console.log({weeks})
	if(days < 8){
		this.dataFlag = true;
		this.final = days;
	} else {
		this.dayOfWeek = days - (weeks * 7 );

		this.dataFlag = false
		this.week = weeks;
		 
	}
	console.log(this.dayOfWeek)

	console.log(this.dataFlag)
	console.log(this.week)
    if (weeks === 0) {
        return days + ' ' + (days > 1 ? 'days' : 'day');
    } else {
        return weeks + ' ' + (Math.round(days / 7) > 1 ? 'weeks' : 'week');
    }

}

console.log(moment().durationInWeeks(passedDate,now)); // 21 weeks
// console.log(moment().durationInWeeks(aPastDay,now));  // 6 days  
})


module.exports = router;