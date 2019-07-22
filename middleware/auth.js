const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { FactoryModels } = require('../models');

module.exports = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.substring(7, req.headers.authorization.length);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).send('You are not logged in! Please log in to get access.');
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await FactoryModels('User').find({ id: decoded.id });
  if (!currentUser) {
    return res.status(401).send('The user belonging to this token does no longer exist.');
  }

  req.user = { id: currentUser.id };
  return next();
};
