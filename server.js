const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors')
const userRoutes = require('./routes/user')

app.use(cors())
connectDB();

app.use(express.json());
app.use('/api',userRoutes)
app.get('/',(req,res)=>{
    res.send("server is running");
})

app.listen(4000,()=>{
    console.log('server is up running with http://localhost:4000');
})