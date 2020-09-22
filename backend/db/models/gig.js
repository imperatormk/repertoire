'use strict'
module.exports = (sequelize, DataTypes) => {
  const Gig = sequelize.define('gig', {
    title: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  })
  Gig.associate = function(models) {
    Gig.hasMany(models.song, {
      foreignKey: 'gig_id',
      as: 'songs'
    })
    Gig.hasMany(models.request, {
      foreignKey: 'gig_id',
      as: 'requests'
    })
    Gig.hasMany(models.suggestion, {
      foreignKey: 'gig_id',
      as: 'suggestions'
    })
  }
  return Gig
}