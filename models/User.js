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
  android_device_token:{type:String},
  ios_device_token:{type:String},
  device:{type:String},
  payId:{type:String},
  transactionIdBook:String,
  ebook: {type: Boolean, default: false},
  book:{type:Boolean, default: false},
  reciept:[{type:Object}],
  is_email_notification:{type:Boolean, default: true},
  is_push_notification:{type:Boolean, default: true},
  created_at:{type:Date, default: Date.now()},
  media:[]
});



userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
