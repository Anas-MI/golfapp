const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Synergistic = require('../models/Synergistic');
const Journal = require('../models/Journal');
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
router.post("/get/synergy", (req, res) => {
console.log("Ddasdscdscdscdscdscdscds")
console.log(req.body)
let newDate = moment(req.body.date).format("MM/DD/YYYY")
console.log({newDate})
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

var now = moment();
let passedDate = moment(newDate)
moment.fn.durationInWeeks = function(fromDate, toDate) {

    var days    = toDate.diff(fromDate, 'days');    
    var weeks   = toDate.diff(fromDate, 'weeks');
	console.log({days})
	console.log({weeks})
	let query;
	//if number of weeks is less than 52
	if(weeks <= 52){
		
		if(days <= 7){

			query = {
				week: 1,
				day: days
			}
		} else if( days >=7){
			let day = days - (weeks * 7)
			query = {
				week: weeks + 1,
				day
			}
		}
		
	} else if(weeks > 52){
		let day = days - (weeks * 7)
		let week = weeks % 52;
		if(week === 0){
			week = 1;
		}
		query = {
			week,
			day
		}
	}


	console.log({query})
	if(req.body.dateToFind){
		this.dayToFind = moment(req.body.dateToFind).format('dddd').toString().toLowerCase()
	} else {
	this.dayToFind = moment().format('dddd').toString().toLowerCase()}
	console.log({"daytofind":this.dayToFind})
	Synergistic.findOne({week: query.week, day: this.dayToFind }).then(data => {
		Journal.find({}).then(journal => {
		console.log({data})
		if(data !== null){
			let dataWithJournal = {...data, ...journal}
			console.log({dataWithJournal})
			res.status(httpStatus.OK).json({status: true, message:"Data fetched", data, journal})
		} 
		else if(data === null){
			Synergistic.find().then(data => {
				let data2 = data[0]
				let dataWithJournal = {journal, data2}
			console.log({dataWithJournal})
				console.log({"sss":data[0]})
				res.status(httpStatus.OK).json({status: true, message:"No synergy found",data:data[0], journal: journal
			})
		})
	}})
}).catch(err => {
			res.status(httpStatus.BAD_REQUEST).json({status: false, message: err})
		})
	


	// if(days < 8){
	// 	this.dataFlag = true;
	// 	this.final = days;
	// } else {
	// 	this.dayOfWeek = days - (weeks * 7 );

	// 	this.dataFlag = false
	// 	this.week = weeks;
		 
	// }
	// console.log(this.dayOfWeek)

	// console.log(this.dataFlag)
	// console.log(this.week)


	// let dayOfWeek = passedDate.isoWeekday();
	// console.log({"day of week": dayOfWeek})
	
    // if (weeks === 0) {
    //     return days + ' ' + (days > 1 ? 'days' : 'day');
    // } else {
    //     return weeks + ' ' + (Math.round(days / 7) > 1 ? 'weeks' : 'week');
    // }

}

console.log(moment().durationInWeeks(passedDate,now)); // 21 weeks
// console.log(moment().durationInWeeks(aPastDay,now));  // 6 days  
})


module.exports = router;