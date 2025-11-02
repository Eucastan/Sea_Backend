const medicationController = require("../controllers/medicationController");
const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorize(["admin"]), medicationController.createMedications);
router.get("/", authMiddleware, authorize(["user", "admin"]), medicationController.getMedications);
router.get("/search", authMiddleware, authorize(["user", "admin"]), medicationController.getDrugs);
router.get("/:id", authMiddleware, authorize(["user", "admin"]), medicationController.getMedicationById);
router.put("/:id", authMiddleware, authorize(["admin"]), medicationController.updateMedication);
router.delete("/:id", authMiddleware, authorize(["admin"]), medicationController.deleteMedication);

module.exports = router;