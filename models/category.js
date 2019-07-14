const category = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });

  Category.associate = models => {
    Category.belongsToMany(models.Snippet, { through: 'snippetCategories' });
  };

  return Category;
};

module.exports = category;
