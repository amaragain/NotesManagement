'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.createTable('Tokens', {
      id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tokens');
  }
};
