const bcrypt = require('bcrypt');

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  // eslint-disable-next-line no-shadow
  User.beforeCreate(async user => {
    user.password = await bcrypt.hash(user.password, 12); // eslint-disable-line no-param-reassign
  });

  User.associate = models => {
    User.hasMany(models.Snippet, { onDelete: 'CASCADE' });
  };

  return User;
};

module.exports = user;
