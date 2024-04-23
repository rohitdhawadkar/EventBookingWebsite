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

module.exports = {
  router,
  Validate,
};
