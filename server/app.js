const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cros = require('cors')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://0.0.0.0:27017/snapchat')
.then(() => {console.log('Connected');})
.catch(() => {console.log('Not Connected');})

const userRouters = require("./routes/user")
const messageRouters = require("./routes/message")

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use(userRouters)
app.use(messageRouters)

app.use((req, res, next) =>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;


