const express = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const Validate = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res
        .status(400)
        .json({ message: "invalid request body", errors: error.errors });
    }
  };
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (role != requiredRole) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

const VerifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.error("No token provided.");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const tokenValue = token.split(" ")[1];
    // console.log("Token value:", tokenValue); // Debugging: Log token value
    const decoded = jwt.verify(tokenValue, "mumbai"); // Verify token with the correct secret key
    // console.log("Decoded token:", decoded); // Debugging: Log decoded token
    if (!decoded || !decoded.role) {
      console.error("Invalid token payload:", decoded);
      return res.status(401).send("Invalid token payload.");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = {
  VerifyToken,
};

module.exports = {
  router,
  Validate,
  checkRole,
  VerifyToken,
};
