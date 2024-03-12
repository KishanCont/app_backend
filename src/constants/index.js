import dotenv from "dotenv";

dotenv.config();

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const MONGO_URI = process.env.MONGO_URI;

export const PORT = process.env.PORT || 5000;
export const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
export const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;

export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
