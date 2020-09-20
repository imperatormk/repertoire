'use strict'
module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define('suggestion', {
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    message: DataTypes.STRING,
    attachments: DataTypes.JSONB,
    reviewed: DataTypes.BOOLEAN
  })
  Suggestion.associate = function(models) {
    Suggestion.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'suggester'
    })
    Suggestion.belongsTo(models.song, {
      foreignKey: 'song_id',
      as: 'song'
    })
  }
  return Suggestion
}