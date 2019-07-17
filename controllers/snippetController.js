const pick = require('lodash/pick');
const Joi = require('joi');
const { models, FactoryModels } = require('../models');

const validate = req => {
  const schema = {
    userId: Joi.number().required(),
    title: Joi.string()
      .max(255)
      .required(),
    code: Joi.string()
      .max(1020)
      .required(),
    categories: Joi.array().items(Joi.object())
  };

  return Joi.validate(req, schema);
};

exports.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const createdSnippet = await FactoryModels('Snippet').create(req.body, {
      include: [models.Category]
    });
    const snippet = pick(createdSnippet, ['id', 'userId', 'title', 'code', 'categories']);

    return res.status(201).json({
      status: 'success',
      snippet
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};
