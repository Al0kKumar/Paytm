const mongoose = require('mongoose')
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async() => {

    try {
        await mongoose.connect(MONGO_URL)
        console.log('Connected to MongoDB');
      } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit the process with failure
      }
    
   }

module.exports = connectDB