'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password_digest: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN,
    verified_date: {
      type: DataTypes.DATE
    }
  })
  User.associate = function(models) {
    User.hasMany(models.request, {
      foreignKey: 'user_id',
      as: 'requests'
    })
  }
  return User
}