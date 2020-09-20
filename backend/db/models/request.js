'use strict'
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('request', {
    message: DataTypes.STRING,
    reviewed: DataTypes.BOOLEAN
  })
  Request.associate = function(models) {
    Request.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'requester'
    })
    Request.belongsTo(models.song, {
      foreignKey: 'song_id',
      as: 'song'
    })
  }
  return Request
}