/*
students -> id, name, university_id, password
reservation -> id, deans_id, student_id, date, time, reserved_at
students -> id, name, university_id, password
session -> id, userid, token, expire_at, created_at
*/

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const DatabaseFunctions = require('./lib/DatabaseFunctions');
const { checkSession } = require('./lib/SessionMiddleware');
const CoreFunctions = require('./lib/CoreFunctions');
const moment = require('moment');
const app = express();
app.use(bodyParser.json());
const db = require('./lib/db');

app.post('/student/login', async (req, res) => {
    var { username, password } = req.body;

    try {
        const student = await DatabaseFunctions.checkStudentCredentials(username, password);

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const sessionId = uuid.v4();
        username = student.username;
        const expireAt = new Date(Date.now() + 3600000);

        await DatabaseFunctions.createSession(username, sessionId, expireAt);

        res.status(200).json({ sessionToken: sessionId });
    } catch (error) {
        console.error('Login Error :', error);
        res.status(500).json({ message: 'An error occurred' });
    }
}); // 3407b1b4-ffe3-475f-a45f-ccdd14f0c77a

app.post('/dean/login', async (req, res) => {
    var { username, password } = req.body;

    try {
        const deans = await DatabaseFunctions.checkdeansCredentials(username, password);

        if (!deans) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const sessionId = uuid.v4();
        username = deans.username;
        const expireAt = new Date(Date.now() + 3600000);

        await DatabaseFunctions.createSession(username, sessionId, expireAt);

        res.status(200).json({ sessionToken: sessionId });
    } catch (error) {
        console.error('Error during deans login:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Route for dean to fetch booked appointments
app.get('/dean/appointments', checkSession, async (req, res) => {
    const deanId = req.userId;
    const deanExists = await DatabaseFunctions.checkDeanExistence(deanId);
    if (!deanExists) {
        return res.status(404).json({ message: 'Dean not found' });
    } else {
        var appointments = await DatabaseFunctions.getDeanAppointments(deanId);
        for (var i = 0; i < appointments.length; i++) {
            appointments[i].date = moment(appointments[i].date).utcOffset(330).format("DD-MM-YYYY");
            var student = await DatabaseFunctions.ferchStudentDetails(appointments[i].student_id);
            appointments[i].student_name=student.name;
        }
        return res.status(200).json({ "count": appointments.length, "appointments": appointments });
    }
});

app.post('/student/book-appointment', checkSession, async (req, res) => {
    var { deanId, date } = req.body;
    var studentId = req.userId;
    date = date.split("-").reverse().join("-");

    const studentExists = await DatabaseFunctions.checkStudentExistence(studentId);
    if (!studentExists) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const deanExists = await DatabaseFunctions.checkDeanExistence(deanId);
    if (!deanExists) {
        return res.status(404).json({ message: 'Dean not found' });
    }

    const isSlotBooked = await DatabaseFunctions.isSlotBookedForDay(deanId, date);
    if (isSlotBooked) {
        return res.status(400).json({ message: 'Slot is already booked for this day' });
    }

    const selectedDate = moment(date).utcOffset(330);
    if (selectedDate.day() !== 4 && selectedDate.day() !== 5) {
        return res.status(400).json({ message: 'Appointments are available only on Thursday or Friday' });
    }

    try {
        await db.query(
            'INSERT INTO reservation (deans_id, student_id, date, time) VALUES (?, ?, ?, ?)',
            [deanId, studentId, date, '10:00:00']
        );

        res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


app.get('/student/available-dates', checkSession, async (req, res) => {
    try {
        var { deanId } = req.body;
        var studentID = req.userId;
        const studentExists = await DatabaseFunctions.checkStudentExistence(studentID);
        if (!studentExists) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const deanExists = await DatabaseFunctions.checkDeanExistence(deanId);
        if (!deanExists) {
            return res.status(404).json({ message: 'Dean not found' });
        }
        //generate a list for next three weeks
        const nextDates = CoreFunctions.getNextThursdayAndFridayDates();
        const reserved = await DatabaseFunctions.getDeanAppointments(deanId);
        var dateAvailable = [];
        for (var i = 0; i < nextDates.length; i++) {
            var found = false;
            for (var j = 0; j < reserved.length; j++) {
                console.log(i, j);
                if (moment(reserved[j].date).utcOffset(330).format("DD-MM-YYYY") == nextDates[i].utcOffset(330).format("DD-MM-YYYY")) {
                    found = true;
                }
            }
            if (!found) {
                dateAvailable.push(nextDates[i].utcOffset(330).format("DD-MM-YYYY"));
            }
        }
        res.status(200).json({ "dates-available": dateAvailable });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
