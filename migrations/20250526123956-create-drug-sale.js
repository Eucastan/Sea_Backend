'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("DrugSale", 
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        totalAmount: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        salesDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        medicationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "Medication",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        createdAt:{
          allowNull:false,
          type: Sequelize.DATE
        },
        updatedAt:{
          allowNull:false,
          type: Sequelize.DATE
        },
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("DrugSale");
  },
};
