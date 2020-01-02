const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    maxlength: 100,
    minlength: 2,
    required: true,
    trim: true,
    type: String
  },
  email: {
    lowercase: true,
    maxlength: 255,
    minlength: 5,
    required: false,
    trim: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String
  },
  state:{
    type:String
  },
  phone:{
    type:String
  },
  age:{
    type:Number
  },
  country:{
    type:String
  },
  ios_token:{type:String},
  android_token:{type:String}
});



userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
