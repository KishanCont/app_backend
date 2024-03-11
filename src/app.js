import express from "express";
import cors from "cors";
import installRouter from "./routes/install.route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/", installRouter);

export default app;
