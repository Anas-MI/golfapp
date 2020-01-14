const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const shippingSchema = new Schema({

        addressLine1: String,
        addressLine2: String,
        country: String,
        state: String,
        city: String,
        pincode: String,
        user:{type:Schema.Types.ObjectId, ref:"User"},
        payId:String,
        paid:{type:Boolean, default: false},
        createdOn:{type:Date, default: Date.now()}
})

module.exports = mongoose.model('Shipping', shippingSchema)