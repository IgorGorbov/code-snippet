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
  const create = async props => {
    const doc = await models[modelName].create(props);
    return doc;
  };

  return {
    create
  };
}

module.exports = { sequelize, FactoryModels };
