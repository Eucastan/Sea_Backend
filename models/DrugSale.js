const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const DrugSale = sequelize.define("DrugSale", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    salesDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    medicationId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "DrugSale"
});

module.exports = DrugSale;