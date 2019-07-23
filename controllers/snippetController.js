const pick = require('lodash/pick');
const Joi = require('joi');
const { models, FactoryModels } = require('../models');

const validate = (req, type) => {
  let schema = null;

  switch (type) {
    case 'create':
      schema = {
        title: Joi.string()
          .max(255)
          .required(),
        code: Joi.string()
          .max(1020)
          .required(),
        categories: Joi.array().items(Joi.object())
      };
      break;

    case 'update':
      schema = {
        id: Joi.number().required(),
        title: Joi.string()
          .max(255)
          .required(),
        code: Joi.string()
          .max(1020)
          .required(),
        categories: Joi.array().items(Joi.object())
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
    const createdSnippet = await FactoryModels('Snippet').create(data, {
      include: [models.Category]
    });
    const snippet = pick(createdSnippet, ['id', 'userId', 'title', 'code', 'categories']);
    snippet.categories = snippet.categories.map(category => pick(category, ['id', 'name']));

    return res.status(201).json({
      status: 'success',
      snippet
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const where = { userId: req.user.id };
    const attributes = ['id', 'userId', 'title', 'code'];

    const snippets = await FactoryModels('Snippet').findAll(where, attributes, [
      { model: models.Category, attributes: ['id', 'name'], through: { attributes: [] } }
    ]);

    return res.status(200).json({ status: 'success', snippets });
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
    const foundSnippet = await FactoryModels('Snippet').find(where, [models.Category]);
    const snippet = pick(foundSnippet, ['id', 'userId', 'title', 'code', 'categories']);
    snippet.categories = snippet.categories.map(category => pick(category, ['id', 'name']));

    return res.status(200).json({
      status: 'success',
      snippet
    });
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
    const isUpdated = await FactoryModels('Snippet').update(req.body, where, [models.Category]);

    if (isUpdated) return res.status(200).json({ status: 'success' });

    return res.status(400).send("Couldn't update snippet.");
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
    const isDeleted = await FactoryModels('Snippet').remove(where);

    if (isDeleted) return res.status(200).json({ status: 'success' });

    return res.status(400).send("Couldn't delete snippet.");
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
};
