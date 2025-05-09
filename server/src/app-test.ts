import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error-handler-middleware";
import AuthRouter from "./routes/auth-routes";
import TodosRouter from "./routes/todos-route";
import { verifyToken } from "./middlewares/auth-middleware";

dotenv.config();

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/todos', verifyToken, TodosRouter);
app.use(errorHandler);

export default app;
