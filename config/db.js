const mongoose = require('mongoose');

module.exports = async function connectDB(){
     
  try {
    const uri = process.env.MONGO_URI;
   
    await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}