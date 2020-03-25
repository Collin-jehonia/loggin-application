var express = require('express')
var cors = require('cors')
var mongoose = require('mongoose')
var multer = require('multer')
var bodyParser = require('body-parser')

var studentSchema = require('./models/student.model')
var lectureSchema = require('./models/lecture.model')
var courseSchema = require('./models/course.model')

var app = express()

var db = "mongodb://localhost:27017/attendance"
mongoose.connect(db, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log("Connected to DB")
    }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: ['http://localhost:4200'] }))
app.get('/student', (req, res) => {

})

app.delete('/student', (req, res) => {

})

app.post('/student', (req, res) => {

})

app.post('/register', (req, res) => {
    console.log(req.body, " from register")
    var formData = req.body

    console.log(formData.registerType == 'lecture', " login is ")
    if (formData.registerType == 'lecture') {
        var lecture = new lectureSchema({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password
        })

        lecture.save((err, doc) => {
            if (doc.length) {
                res.send({ status: true, message: "registered user" })
            }
        })
    } else if (formData.registerType == 'student') {
        var student = new studentSchema({
            firstname: formData.firstname,
            lastname: formData.lastname,
            studentNumber: formData.studentNumber,
            password: formData.password,
            course: formData.course
        })

        student.save((err, doc) => {
            if (doc) {
                res.send({ status: true, message: "registered user" })
            }
        })
    }
})

app.post('/login', (req, res) => {
    var formData = req.body

    if (formData.loginType == 'lecture') {
        lectureSchema.find({ email: formData.username }, (err, doc) => {
            if (doc.length) {
                res.send({ status: true, message: "logged in" })
            }

        })
    } else if (formData.loginType == 'student') {
        studentSchema.find({ studentNumber: formData.username }, (err, doc) => {
            if (doc.length) {
                res.send({ status: true, message: "logged in" })
            }
        })
    }
})

app.post('/course', (req, res) => {
    var data = req.body
    var sess = new courseSchema({
        courseCode: data.code,
        courseName: data.name
    })

    sess.save((err, doc) => {
        console.log(err, 'inserting course')
        res.send(doc)
    })
})

app.put('/schedule', (req, res) => {
    var data = req.body
    courseSchema.findOneAndUpdate({ courseCode: data.code }, {
        $push: {
            classes:
            {
                date: data.date,
                venue: data.venue,
                type: data.type,
                week: data.week,
            }
        }

    }, (err, doc) => {
        console.log(err)
        res.send(doc)
    })
})

//tobe fixed
app.post('/reSchedule', (req, res) => {
    var data = new Date(req.body.date)
    courseSchema.findOne(function (err, doc) {
        doc.date.setMonth(data.getMonth);
        doc.save(callback);

        doc.markModified('date');
        doc.save(callback);
    })
})

app.post('/setSession', (req, res) => {
    var pass = "random"
    courseSchema.update({ 'classes.date': req.body.date },
        { $set: { "classes.$[elem].open": true } },
        { arrayFilters: [{ "elem.date": req.body.date }] },
        (err, doc) => {
            if (doc) {
                closeSession(req.body.date)
                res.send({ status: true, message: pass })
            } else {
                res.send({ status: false, message: "Unable to create phrase. Retry!" })
            }
        })
})

function closeSession(date) {
    setTimeout(() => {
        courseSchema.update({ 'classes.date': date },
            { $set: { "classes.$[elem].open": false } },
            { arrayFilters: [{ "elem.date": date }] }, (err, cb) => {
                console.log(cb)
            })
    },(60*60*10))
}

app.post('/verifyAttendance', (req, res) => {
    courseSchema.update({ 'classes.passphrase': req.body.phrase },
        { $push: { "classes.$[elem].attendance": req.body.std } },
        { arrayFilters: [{ "elem.open": true }] },
        (err, doc) => {
            if (doc) {
                studentSchema.findOneAndUpdate({ studentNumber: req.body.std },
                    { attendance: { $push: { date: new Date().getTime, status: 'present' }}}, 
                    (err, sDoc)=>{
                        console.log(sDoc)
                    })
                res.send({ status: true, message: "vouched for" })
            }
        })

})


var PORT = 5000
app.listen(5000, () => {
    console.log("listening on port ", PORT)
})

