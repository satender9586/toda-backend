const mongoose = require("mongoose")
const dotenv = require("dotenv")
const color = require("colors")

dotenv.config()

const connectDB = async ()=>{
    try {
        const connection  = await mongoose.connect(process.env.DB_CONNECTION_URL);
        console.log(color.yellow(`mongoDB connected : ${connection.connection.host}`))
    } catch (error) {
        console.log(color.red(`error connecting to MongoDB : ${error.message}`))
        
    }
}

module.exports =  connectDB