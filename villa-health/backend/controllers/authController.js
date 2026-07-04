const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Specialist = require("../models/Specialist");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === "specialist" ? "specialist" : "patient",
    });

    // Create the matching profile document based on role
    if (user.role === "patient") {
      await Patient.create({ user: user._id });
    } else if (user.role === "specialist") {
      await Specialist.create({
        user: user._id,
        specialty: req.body.specialty || "General Practice",
        licenseNumber: req.body.licenseNumber || "PENDING",
        consultationFee: req.body.consultationFee || 0,
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    const token = generateToken(user._id);
    res.json({ user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route GET /api/auth/me
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getProfile };
