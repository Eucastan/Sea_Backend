const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const drugSaleRoutes = require("./routes/drugSaleRoutes");
const {syncDB} = require("./models");
const errorHandler = require("./middleware/errorHandler")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/sales", drugSaleRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
syncDB().then(()=>{
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
