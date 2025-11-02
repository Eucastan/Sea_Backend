const express = require("express");
const drugSaleController = require("../controllers/drugSaleController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorize(["admin"]), drugSaleController.createDrugSale);
router.get("/", authMiddleware, authorize(["admin"]), drugSaleController.getAllSales);
router.get("/sales-report", authMiddleware, authorize(["admin"]), drugSaleController.getSalesReport);
router.get("/grouped-report", authMiddleware, authorize(["admin"]), drugSaleController.getGroupedSalesReport);

module.exports = router;