'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('myblogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectnama: {
        allowNull: false,
        type: Sequelize.STRING
      },
      startdate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      enddate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      desc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      technologies: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      images: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('myblogs');
  }
};