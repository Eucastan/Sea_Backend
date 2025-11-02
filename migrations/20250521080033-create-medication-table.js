'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Medication",
      {
        id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
        medsName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dosage: {
            type: Sequelize.STRING,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        available: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        createdAt:{
          allowNull:false,
          type: Sequelize.DATE
        },
        updatedAt:{
          allowNull:false,
          type: Sequelize.DATE
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Medication");
  }
};
