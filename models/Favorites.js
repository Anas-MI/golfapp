const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User"},
    synergistic:{type:Schema.Types.ObjectId, ref: "Synergistic"},
    createdAt:{type: Date, default:Date.now},
    goal:String,
    name:String,
    date:String
})



module.exports = mongoose.model("Favorites", favoritesSchema)