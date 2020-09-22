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

const configs = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: Sequelize.JSONB,
    allowNull: false
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

const gigs = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false
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

const songs = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  gig_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'gigs',
      key: 'id',
      as: 'gig_id'
    },
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false
  },
  attachments: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
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

const requests = (Sequelize) => ({
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
  gig_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'gigs',
      key: 'id',
      as: 'gig_id'
    },
    allowNull: false
  },
  songs: {
    type: Sequelize.ARRAY(Sequelize.BIGINT),
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reviewed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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

const suggestions = (Sequelize) => ({
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
  gig_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'gigs',
      key: 'id',
      as: 'gig_id'
    },
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  attachments: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  reviewed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const usersP = queryInterface.createTable('users', users(Sequelize))
      const gigsP = queryInterface.createTable('gigs', gigs(Sequelize))
      return Promise.all([usersP, gigsP])
        .then(() => {
          const songsP = queryInterface.createTable('songs', songs(Sequelize))
          return Promise.all([songsP])
            .then(() => {
              const tokensP = queryInterface.createTable('tokens', tokens(Sequelize))
              const configsP = queryInterface.createTable('configs', configs(Sequelize))
              const requestsP = queryInterface.createTable('requests', requests(Sequelize))
              const suggestionsP = queryInterface.createTable('suggestions', suggestions(Sequelize))
              return Promise.all([tokensP, configsP, requestsP, suggestionsP])
            })
        })
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      const tokensP = queryInterface.dropTable('tokens')
      const configsP = queryInterface.dropTable('configs')
      const requestsP = queryInterface.dropTable('requests')
      const suggestionsP = queryInterface.dropTable('suggestions')
      return Promise.all([tokensP, configsP, requestsP, suggestionsP])
        .then(() => {
          const songsP = queryInterface.dropTable('songs')
          return Promise.all([songsP])
          .then(() => {
              const usersP = queryInterface.dropTable('users')
              const gigsP = queryInterface.dropTable('gigs')
              return Promise.all([usersP, gigsP])
            })
        })
    })
  }
}