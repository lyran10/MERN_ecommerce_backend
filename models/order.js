// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  items:[{
    product:{type:mongoose.Schema.Types.ObjectId, ref:'Product'}, 
    qty:Number, price:Number
  }],
  total:Number,
  status:{type:String, default:'pending'},
  shippingAddress:Object,
  paymentInfo:Object
}, {timestamps:true});

module.exports = mongoose.model('Order', orderSchema);
