const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const synergisticSchema = new Schema({
	name: { type: String },
	goal: { type: String },
	explanation: { type: String },
	nutritionTip: { type: String },
	thoughts: { type: String },
	thoughtsBy: { type: String },
	thinkGolf: { type: String },
	makeMeSmile: { type: String },
	week: { type: String },
	day: { type: String },
	entries:[]
});

module.exports = mongoose.model('Synergistic', synergisticSchema);
