const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
const colors = require('colors');
const userRoutes = require("./src/routes/authRouts.js")
const noteRoutes =  require("./src/routes/noteRouts.js")
const connectDB = require("./src/config/DB_connection.js")
const authenticate= require("./src/middleware/authMiddleware.js")
const morgan = require("morgan");



dotenv.config()
connectDB()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'));



// routes
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/note",authenticate,noteRoutes)



// server run configuration
const PORT = process.env.DEVELOPMENT_PORT || 5000;
app.listen(PORT, ()=>{
    console.log(colors.yellow(`server is running on port no : ${PORT}`))
})
