// const mongoose = require('mongoose')
import mongoose from "mongoose"
import { MONGO_DB_URL } from "./mongodb-config"
const ConnectToDB = async () => {
    try {
        if(process.env.NODE_ENV !== 'test'){
            await mongoose.connect(MONGO_DB_URL)
        }
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MongoDB connection failed!",error)
    }
}

export default ConnectToDB