const pick = require('lodash/pick');
const Joi = require('joi');
const { FactoryModels } = require('../models');

const validate = (req, type) => {
  let schema = null;

  switch (type) {
    case 'create':
      schema = {
        name: Joi.string()
          .max(255)
          .required()
      };
      break;

    case 'update':
      schema = {
        id: Joi.number().required(),
        name: Joi.string()
          .max(255)
          .required()
      };
      break;

    case 'get':
    case 'remove':
      schema = { id: Joi.number().required() };
      break;

    default:
      break;
  }

  return Joi.validate(req, schema);
};

exports.create = async (req, res) => {
  const { error } = validate(req.body, 'create');
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const data = { ...req.body, userId: req.user.id };
    const category = await FactoryModels('Category').create(data);

    return res.status(201).json({
      status: 'success',
      category: pick(category, ['id', 'userId', 'name'])
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};

exports.get = async (req, res) => {
  const { error } = validate(req.params, 'get');
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const where = { id: req.params.id };
    const foundCategory = await FactoryModels('Category').find(where);
    const category = pick(foundCategory, ['id', 'name']);

    return res.status(200).json({
      status: 'success',
      category
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const where = { userId: req.user.id };
    const attributes = ['id', 'name', 'userId'];

    const categories = await FactoryModels('Category').findAll(where, attributes);

    return res.status(200).json({ status: 'success', categories });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { error } = validate({ ...req.params, ...req.body }, 'update');
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const where = { ...req.params, userId: req.user.id };

    const isUpdated = await FactoryModels('Category').update(req.body, where);

    if (isUpdated) return res.status(200).json({ status: 'success' });

    return res.status(400).send("Couldn't update category.");
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};

exports.delete = async (req, res) => {
  const { error } = validate(req.params, 'remove');
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const where = { id: req.params.id, userId: req.user.id };
    const isDeleted = await FactoryModels('Category').remove(where);

    if (isDeleted) return res.status(200).json({ status: 'success' });

    return res.status(400).send("Couldn't delete category.");
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};
