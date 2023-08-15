const db = require('./db');
var md5 = require('md5');

async function checkStudentCredentials(username, password) {
  const [student] = await db.query(
    'SELECT id, name, username, password FROM students WHERE username = ?',
    [username]
  );

  return student.length > 0 && student[0].password === md5(password)
    ? student[0]
    : null;
}
async function checkdeansCredentials(username, password) {
    const [deans] = await db.query(
      'SELECT id, name, username,password FROM deans WHERE username = ?',
      [username]
    );
  
    return deans.length > 0 && deans[0].password === md5(password)
      ? deans[0]
      : null;
  }
  
  
async function createSession(userId, token, expireAt) {
  await db.query(
    'INSERT INTO session (userid, token, expire_at) VALUES (?, ?, ?)',
    [userId, token, expireAt]
  );
}

async function checkDeanExistence(deanUsername) {
    const [dean] = await db.query(
      'SELECT username FROM deans WHERE username = ?',
      [deanUsername]
    );
  
    return dean.length > 0;
  }
async function checkStudentExistence(studentUsername) {
    const [student] = await db.query(
      'SELECT username FROM students WHERE username = ?',
      [studentUsername]
    );
  
    return student.length > 0;
  }
async function ferchStudentDetails(studentUsername) {
    const [student] = await db.query(
      'SELECT name FROM students WHERE username = ?',
      [studentUsername]
    );
  
    return student.length > 0?student[0]:"Not Found!";
  }

  async function getDeanAppointments(deanUsername) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
    const [appointments] = await db.query(
      'SELECT * FROM reservation WHERE deans_id = ? AND date >= ?',
      [deanUsername, today]
    );
  console.log(appointments);
    return appointments;
  }
  
  async function isSlotBookedForDay(deanUsername, date) {
    const [reservation] = await db.query(
      'SELECT id FROM reservation WHERE deans_id = ? AND date = ?',
      [deanUsername, date]
    );
  console.log(reservation);
    return reservation.length > 0;
  }
  

module.exports = {
  checkStudentCredentials,
  checkdeansCredentials,
  checkStudentExistence,
  ferchStudentDetails,
  createSession,
  checkDeanExistence,
  getDeanAppointments,
  isSlotBookedForDay
};
