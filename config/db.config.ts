import dotenv from "dotenv";
dotenv.config();

export default {
  HOST: process.env.DB_HOST || "localhost:27017",
  NAME: process.env.DB_NAME,
};
