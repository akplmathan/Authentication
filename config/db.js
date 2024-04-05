const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async()=>{
       try {
            await mongoose.connect(process.env.URL);
            console.log("mongodb connected SuccessFully")
       } catch (error) {
        console.log(error)
       } 
};

module.exports = connectDB;

