const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let analytics = new Schema({
    user: Number, favorites: Number, orders: Number, ebooks: Number, synergistic: Number,
    oldUser: Number, oldFavorites: Number, oldOrders: Number, oldEbooks: Number, oldSynergistic: Number
})

module.exports = mongoose.model("Analytics", analytics)