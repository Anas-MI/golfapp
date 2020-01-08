const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Schema = mongoose.Schema;

const aboutUsSchema = new Schema({
    content:{
        type:String, 
        required: true
    }
})

module.exports = mongoose.model("AboutUs", aboutUsSchema)