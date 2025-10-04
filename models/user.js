// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {type:String, unique:true},
  name: String,
  email: {type:String, index:true},
  avatar: String,
  role: {type:String, default:'user'},
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref:'Product'}]
}, {timestamps:true});

module.exports = mongoose.model('User', userSchema);