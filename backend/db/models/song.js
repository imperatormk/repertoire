'use strict'
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('song', {
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    attachments: DataTypes.JSONB,
    type: DataTypes.STRING
  })
  Song.associate = function(models) {
    Song.belongsTo(models.gig, {
      foreignKey: 'gig_id',
      as: 'gig'
    })
  }
  return Song
}