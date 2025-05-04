import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.post("/signUp", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Checking for an existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "The user already exists" });
        }
        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
