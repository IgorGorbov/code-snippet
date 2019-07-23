const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connection to database.');
  })
  .catch(err => {
    console.log('Error connection to database:', err);
  });

const models = {
  User: sequelize.import('./user'),
  Snippet: sequelize.import('./snippet'),
  Category: sequelize.import('./category')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) models[key].associate(models);
});

function FactoryModels(modelName) {
  const create = async (props, include) => {
    let doc = null;
    if (props && include) doc = await models[modelName].create(props, include);
    else doc = await models[modelName].create(props);

    return doc;
  };

  const find = async (where, include = []) => {
    if (!where) return null;

    const doc = await models[modelName].findOne({ where, include });
    return doc;
  };

  const findAll = async (where, attributes = [], include = []) => {
    if (!where) return null;

    const doc = await models[modelName].findAll({ where, attributes, include });
    return doc;
  };

  const update = async (data, where, include = []) => {
    if (!data || !where) return false;

    const [rowsUpdate] = await models[modelName].update(data, { where, include });

    return !!rowsUpdate;
  };

  const remove = async where => {
    if (!where) return false;

    const rowsDeleted = await models[modelName].destroy({ where });

    return !!rowsDeleted;
  };

  return {
    create,
    find,
    findAll,
    update,
    remove
  };
}

module.exports = { sequelize, models, FactoryModels };
