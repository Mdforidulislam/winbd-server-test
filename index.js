const express = require('express');
const connectDB = require('./src/db/connectDB');
const router = require('./src/routes');
const globalErrorHandler = require('./src/utils/globalErrorHandler');
const app = express();
var bodyParser = require('body-parser')
const cors = require('cors');
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


app.all('*',(req,res,next)=>{
    const error = new Error(`can't find ${req.originalUrl}on the server`)
    error.status = 404;
    next(error)
})

app.use(globalErrorHandler)


const main = async () =>{
    await connectDB()
    app.listen(port,()=>{
        console.log(`admin managment system runing ${port}`);
    });
}

main()

module.exports = app; 