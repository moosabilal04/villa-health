const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT sent in the Authorization header
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Not authorized, user not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Restricts a route to one or more roles, e.g. authorize("admin", "specialist")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden, insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorize };
