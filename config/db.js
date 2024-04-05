const mongoose = require('mongoose');
const URL='mongodb+srv://akplmathan:Mathan2003@cluster0.kz3flho.mongodb.net/Project-1'

const connectDB = async()=>{
       try {
            await mongoose.connect(URL);
            console.log("mongodb connected SuccessFully")
       } catch (error) {
        console.log(error)
       } 
};

module.exports = connectDB;

