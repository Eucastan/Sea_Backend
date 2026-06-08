const sequelize = require("../config/database");
const User = require("./User");
const Medication = require("./Medication");
const DrugSale = require("./DrugSale");


Medication.hasMany(DrugSale, {
    foreignKey: "medicationId",
    onDelete: "CASCADE"
});

DrugSale.belongsTo(Medication, {
    foreignKey: "medicationId"
});

const syncDB = async () => {
    try{
        await sequelize.authenticate();
        console.log("Authentication successful");

        // Only alter in development
        if (process.env.NODE_ENV !== "production") {      
        await sequelize.sync({ force: false, alter: true });
        console.log("Database synchronized (dev mode).");
        }

    } catch (err) {
        console.error("Database Sync failed:", err);
    }
};

module.exports ={ sequelize, Medication, DrugSale, syncDB, User };
