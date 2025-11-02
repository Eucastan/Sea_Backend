const { DrugSale, Medication } = require("../models");
const { Op } = require("sequelize");

const createDrugSale = async (req, res) => {
    try{
        const {medicationId, quantity, salesDate} = req.body;

        if(req.user.role !== "admin"){
            return res.status(403).json("Access denied");
        }
        //check if medication exist
        const medication = await Medication.findByPk(medicationId);
        if(!medication){
            return res.status(404).json({msg: "Medication Not Found!"});
        }

        //check availability
        if(medication.available < quantity){
            return res.status(400).json({msg: "Insuficient stock"});
        }

        //Calculate total amount
        const totalAmount = medication.price * quantity;
        //Create sale record
        const sale = await DrugSale.create({medicationId, quantity, totalAmount, salesDate});
        //Update available stock
        medication.available -= quantity;
        await medication.save();
        res.status(201).json({msg: "Sale recorded", sale});
        
    }catch(err){
        console.error("Error creating sale: ", err);
        res.status(500).json({msg: "Internal server error", error: err});
    }
}

const getAllSales = async (req, res) => {
    try{
        const sales = await DrugSale.findAll({
            include: { model: Medication}
        });
        res.status(200).json(sales);
    }catch(err){
        res.status(500).json({msg: "Failed to fetch sales"});
    }
}

const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.salesDate = {
                [Op.between]: [startDate, endDate]
            };
        }

        const sales = await DrugSale.findAll({
            where: whereClause,
            include: Medication
        });

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

        res.json({
            count: sales.length,
            totalRevenue,
            totalItemsSold,
            sales
        });
    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getGroupedSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, groupBy } = req.query;

        // Step 1: Build a filter for date range if provided
        const whereClause = {};
        if (startDate && endDate) {
            whereClause.salesDate = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Step 2: Fetch sales with medications, ordered by date
        const sales = await DrugSale.findAll({
            where: whereClause,
            include: Medication,
            order: [["salesDate", "ASC"]],
        });

        // Step 3: Group sales
        const grouped = {};

        for (const sale of sales) {
            const date = new Date(sale.salesDate);
            let key;

            if (groupBy === "month") {
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // e.g. "2025-05"
            } else if (groupBy === "week") {
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDays = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
                const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
                key = `${date.getFullYear()}-W${weekNumber}`;
            } else {
                // Default to daily
                key = date.toISOString().split('T')[0]; // e.g. "2025-05-26"
            }

            // Step 4: Accumulate data
            if (!grouped[key]) {
                grouped[key] = {
                    period: key,
                    total: 0,
                    itemsSold: 0
                };
            }

            grouped[key].total += sale.totalAmount;
            grouped[key].itemsSold += sale.quantity;
        }

        // Step 5: Convert grouped data to array (chart-friendly)
        const result = Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));

        res.status(200).json(result);
    } catch (err) {
        console.error("Sales grouping error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {createDrugSale, getAllSales, getSalesReport, getGroupedSalesReport};