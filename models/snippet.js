const snippet = (sequelize, DataTypes) => {
  const Snippet = sequelize.define('snippet', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(1024),
      allowNull: false
    }
  });

  Snippet.associate = models => {
    Snippet.belongsToMany(models.Category, { through: 'snippetCategories' });
  };

  return Snippet;
};

module.exports = snippet;
