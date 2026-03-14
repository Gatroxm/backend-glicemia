import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

export default app;