import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectToDB from "./config/db";
import { errorHandler } from "./middlewares/error-handler-middleware";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { verifyToken } from "./middlewares/auth-middleware";
import AuthRouter from "./routes/auth-routes";
import TodosRouter from "./routes/todos-route";
import UsersRouter from "./routes/users-routes";
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", verifyToken, UsersRouter);
app.use("/api/v1/todos", verifyToken, TodosRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  try {
    ConnectToDB();
    console.log("running on port :", PORT);
  } catch (error) {
    console.log("Connection failed!", error);
  }
});

export default app;
