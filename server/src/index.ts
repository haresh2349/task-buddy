import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  cookieParser from "cookie-parser";
import ConnectToDB from "./config/db";
import { errorHandler } from "./middlewares/error-handler-middleware";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(errorHandler)

app.listen(PORT,() => {
    try {
        ConnectToDB();
    } catch (error) {
        console.log('Connection failed!',error)
    }
})