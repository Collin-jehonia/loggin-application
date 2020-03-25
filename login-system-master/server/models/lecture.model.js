var mongoose = require('mongoose')

var lectureSchema = new mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String
})


module.exports = mongoose.model('lecture', lectureSchema)