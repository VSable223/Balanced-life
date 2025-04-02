import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user and save to DB
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: err.message });
    }
});



// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

console.log("Auth routes loaded");


export default router;
