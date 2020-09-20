'use strict'
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('song', {
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    attachments: DataTypes.JSONB
  })
  Song.associate = function(models) {
    Song.hasMany(models.request, {
      foreignKey: 'song_id',
      as: 'requests'
    })
    Song.hasMany(models.suggestion, {
      foreignKey: 'song_id',
      as: 'suggestions'
    })
  }
  return Song
}