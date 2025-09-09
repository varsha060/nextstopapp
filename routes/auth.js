import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// ✅ Signup API
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in DB
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Signup failed", details: error });
  }
});


// ✅ Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error });
  }
});


// ✅ Save Favorite Stops & Routes
router.post("/favorites", async (req, res) => {
  try {
    const { userId, favStops, favRoutes } = req.body;

    // Update user favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favStops: { $each: favStops }, favRoutes: { $each: favRoutes } } },
      { new: true }
    );

    res.json({ message: "Favorites updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Could not save favorites", details: error });
  }
});

export default router;
