import dotenv from "dotenv";

dotenv.config();

const DB_NAME = "/Token_Database";
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const MONGO_URI = process.env.MONGO_URI + DB_NAME;

export const PORT = process.env.PORT || 5000;
