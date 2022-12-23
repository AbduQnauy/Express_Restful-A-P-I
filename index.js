const mongoose = require('mongoose')
const courses = require('./routes/courses.js')
const home = require('./routes/home.js')

// Backage for Data validation. 

// Backage for manage Configuraion
const config = require('config')

const express = require('express')
const app = express()

// Database configuraton
mongoose.connect('mongodb://localhost:27017/express-demo')
    .then(() => console.log('Connected to mongoDB....'))
    .catch(error => console.log('Could not connected to DB....', error.message))

// Built-in MiddleWare
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use('/api/courses', courses)
app.use('/', home)


// Configuration
console.log('Application Name: ', config.get('name'));
console.log('Mail Server Name: ', config.get('mail.host'));
// console.log('Mail Password: ', config.get('mail.__password'));
// console.log('Mail address: ', config.get('mail.add'));

if(app.get('env') === "development"){
    console.log('development environment');
}

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}...`))