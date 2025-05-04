import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //  Find a user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Incorrect email or password" });
        }

        // Check the correctness of the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Incorrect email or password" });
        }

        // Creating a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // Response to the client
        res.status(200).json({ message: "Successful entry", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
