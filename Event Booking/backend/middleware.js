const express = require("express");
const { z } = require("zod");

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
  return (res, req, next) => {
    const { role } = req.user;
    if (role != requiredRole) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

const VerifyToken = (req, res, next) => {
  const token = req.headers.authorization;==

  if (!token) {
    res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "rohit2002");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json("Inavlid Token");
  }
};

module.exports = {
  router,
  Validate,
  checkRole,
  VerifyToken,
};
