const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Schema = mongoose.Schema;

const howItWorksSchema = new Schema({
    content:{
        type:String, 
        required: true
    }
})

module.exports = mongoose.model("HowItWorks", howItWorksSchema)