'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('UsersEvents', 'role', {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('UsersEvents', 'role');

      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_UsersEvents_role" CASCADE;');
    },
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
};
