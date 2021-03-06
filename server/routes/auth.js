const { FORBIDDEN } = require('@httpSt');
const jwt = require('jsonwebtoken');

const {
  SIGNATURE,
  // EXPIRATION
} = require('@config').jwt;

module.exports.isAuth = (req, res, next) => {
  if (req.session.token) return next();
  res.status(FORBIDDEN).json({ success: false });
};

module.exports.setToken = (id, cb) => {
  try {
    return jwt.sign(
      { id },
      SIGNATURE,
      // { expiresIn: EXPIRATION }
    );
  } catch (err) {
    cb(err);
  }
};

module.exports.userId = (token, cb) => {
  try {
    const decoded = jwt.verify(token, SIGNATURE);
    return decoded.id;
  } catch (err) {
    cb(err);
  }
};
