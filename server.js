const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const speciesRoutes = require("./routes/speciesRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const errorHandler = require("./middleware/errorHandler")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/species", speciesRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)

// Error Handler
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

