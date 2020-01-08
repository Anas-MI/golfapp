const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User"},
    synergistic:{type:Schema.Types.ObjectId, ref: "Synergistic"},
    createdAt:{type: Date, default:Date.now},

})

module.exports = mongoose.model("Favorites", favoritesSchema)