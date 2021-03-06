const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
	url: { type: String },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default:Date.now() },
	isEnabled: { type: Boolean, default: true },
	title: { type: String },
	description: { type: String },
	isPaid: { type: Boolean },
	thumbnail: { type: String },
    day: { type: String },
	position:{type:Number},
	subscriptions:[]
});

module.exports = mongoose.model('WorkOut', workoutSchema);
