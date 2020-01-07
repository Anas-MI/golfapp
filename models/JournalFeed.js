const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const journalFeedSchema = new Schema({
	journalFeed: [
        { questionId: {type: Schema.Types.ObjectId, ref: "Journal" }, question:String, answer: {type: String}}],
        user:{type:Schema.Types.ObjectId, ref:"User"},
        week :{type: Number},
        createdAt:{type:Date,default:Date.now()}
    });

module.exports = mongoose.model('JournalFeed', journalFeedSchema);
