'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notes', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      note: {
        type: Sequelize.STRING(400),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Notes');
  }
};
