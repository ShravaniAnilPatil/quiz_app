const jwt = require('jsonwebtoken');
const JWT_SECRET = "Shravaniisagood$girl"; 
console.log(hello);
const fetchUser = (req, res, next) => {

  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = fetchUser;
