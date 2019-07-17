const pick = require('lodash/pick');
const Joi = require('joi');
const { FactoryModels } = require('../models');

const validate = req => {
  const schema = {
    name: Joi.string()
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
};

exports.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const category = await FactoryModels('Category').create(req.body);

    return res.status(201).json({
      status: 'success',
      category: pick(category, ['id', 'name'])
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};
