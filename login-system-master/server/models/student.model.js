var mongoose = require('mongoose')

var studentSchema = new mongoose.Schema({
    studentNumber : String,
    firstname : {type : String, toLowercase : true},
    lastname : {type : String, toLowercase : true},
    password : String,
    course : {type : String, toLowercase : true},
    attendance : {
        type : Array,
        items : {
            date : Date,
            status : { type : String, enum : ['present', 'absent']}
        }
    }
})

module.exports = mongoose.model('student', studentSchema)