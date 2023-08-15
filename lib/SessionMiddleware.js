const db = require('./db');

async function checkSession(req, res, next) {
  var token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }
  token = token.split(' ')[1];
  try {
    const [session] = await db.query(
      'SELECT userid, expire_at FROM session WHERE token = ?',
      [token]
    );

    if (session.length === 0 || new Date() > session[0].expire_at) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    req.userId = session[0].userid; // Attach user ID to the request
    next();
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = {
  checkSession,
};
