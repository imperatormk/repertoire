'use strict'

const users = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password_digest: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
  },
  verified_date: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const tokens = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  user_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'user_id'
    },
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  valid_to: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const addUnique = (queryInterface, tableName, fields) => {
  return queryInterface.addIndex(tableName, fields, {
    name: tableName + 'Unique',
    unique: true
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const usersP = queryInterface.createTable('users', users(Sequelize))
      return Promise.all([usersP])
        .then(() => {
          const tokensP = queryInterface.createTable('tokens', tokens(Sequelize))
          return Promise.all([tokensP])
        })
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      const tokensP = queryInterface.dropTable('tokens')
      return Promise.all([tokensP])
        .then(() => {
          const usersP = queryInterface.dropTable('users')
          return Promise.all([usersP])
        })
    })
  }
}