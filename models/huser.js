const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const huserSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pnum: {
    type:Number,
    required: true
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },
  secretToken:{
    type:String,
    required:false
  },
  active:{
    type:Boolean

  }
});
// Model
const huser = mongoose.model('huser', huserSchema);
module.exports = huser;
