const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const journalSchema = new Schema({
	question: { type: String }
});

module.exports = mongoose.model('Journal', journalSchema);
