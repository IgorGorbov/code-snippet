const snippet = (sequelize, DataTypes) => {
  const Snippet = sequelize.define('snippet', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Snippet.associate = models => {
    Snippet.belongsToMany(models.Category, { through: 'snippetCategories' });
  };

  return Snippet;
};

module.exports = snippet;
