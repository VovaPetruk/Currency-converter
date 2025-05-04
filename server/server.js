import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import loginRoutes from "./routes/login.js";
import signUpRoutes from "./routes/signUp.js";
import currencyRoutes from "./routes/currencyRoutes.js";

dotenv.config({ path: "./server/.env" });
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
    res.send("The server is working");
});

app.use(loginRoutes);
app.use(signUpRoutes);
app.use("/api/currency", currencyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`The server is running on the port ${PORT}`);
});
