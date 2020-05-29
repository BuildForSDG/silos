const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get auth header value
  const auth = req.headers.authorization;
  // Check if the bearer is undefined
  if (typeof auth !== 'undefined') {
    const bearer = auth.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
      if (err) {
        res.status(403).json({
          message: 'Access denied'
        });
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({
      message: 'Access denied'
    });
  }
};

module.exports = verifyToken;
