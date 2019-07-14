const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const Joi = require('joi');
const {
  models: { User }
} = require('../models');

const validate = req => {
  const schema = {
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
  };

  return Joi.validate(req, schema);
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    user: pick(user, ['id', 'username', 'isAdmin'])
  });
};

exports.signup = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.create(req.body);
    return createSendToken(user, 201, req, res);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};
