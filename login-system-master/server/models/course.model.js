var mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    courseCode : String,
    courseName : String,
    classes : {
        type : Array,
        items : {
            date : Date,
            venue : String,
            type : String,
            attendance : [String],
            week : String,
            passphrase : String,
            open : Boolean
        }
    }
})

module.exports = mongoose.model('course', courseSchema)