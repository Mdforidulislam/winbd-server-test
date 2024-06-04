const express = require('express');
const connectDB = require('./src/db/connectDB');
const router = require('./src/routes');
const globalErrorHandler = require('./src/utils/globalErrorHandler');
const app = express();
const bodyParser = require('body-parser')
const request = require('request');
const cors = require('cors');
const { connectRedis } = require('./src/config/redis');
const port = process.env.PORT || 5000;

require('dotenv').config();


// corse origin access here 

app.use(cors())
app.use(bodyParser.json());

// all router access here 
app.use(router)

// connection database here 
app.get("/health",(req,res)=>{
    res.send('admin system running ')
})

// verify token == livechateWebsiteToken123 ( here just add )



app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests



app.all('*',(req,res,next)=>{
    const error = new Error(`can't find ${req.originalUrl}on the server`)
    error.status = 404;
    next(error)
})

app.use(globalErrorHandler)

// connect mongodb
const main = async () =>{
    await connectDB()
    app.listen(port,()=>{
        console.log(`admin managment system runing ${port}`);
    });
}



main()

module.exports = app; 