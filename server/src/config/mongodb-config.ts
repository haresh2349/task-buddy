import dotenv from "dotenv"
dotenv.config();

const MONGO_DB_URL =
    process.env.MONGO_DB_PROTOCOL == "mongodb+srv"
      ? `${process.env.MONGO_DB_PROTOCOL}://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}`
      : `${process.env.MONGO_DB_PROTOCOL}://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`

export {MONGO_DB_URL}