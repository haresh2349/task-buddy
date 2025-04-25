// const mongoose = require('mongoose')
import mongoose from "mongoose"
import { MONGO_DB_URL } from "./mongodb-config"
const ConnectToDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URL)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MongoDB connection failed!",error)
    }
}

export default ConnectToDB