import jwt from 'jsonwebtoken';

/* eslint-disable consistent-return */

const auth = (req, res, next) => {
  // extract the authorization header
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== 'undefined') {
    // split token and bearer into bearer array
    const bearer = authHeader.split(' ');

    // set token
    const token = bearer[1];

    // verify the auth user
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          errors: { message: 'Invalid or Expired Token' }
        });
      }
      req.user = user;
      return next();
    });
  } else {
    return res.status(401).json({
      status: 'error',
      errors: { message: 'Unauthenticated User' }
    });
  }
};

export default auth;
