'use strict'
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('request', {
    message: DataTypes.STRING,
    reviewed: DataTypes.BOOLEAN,
    songs: DataTypes.ARRAY(DataTypes.BIGINT)
  })
  Request.associate = function(models) {
    Request.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'requester'
    })
    Request.belongsTo(models.gig, {
      foreignKey: 'gig_id',
      as: 'gig'
    })
  }
  return Request
}