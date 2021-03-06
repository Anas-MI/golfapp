const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const journalFeedSchema = new Schema({
	journalFeed: {},
        user:{type:Schema.Types.ObjectId, ref:"User"},
        week :{type: Number},
        createdAt:{type:Date,default:Date.now()}
    });

module.exports = mongoose.model('JournalFeed', journalFeedSchema);
