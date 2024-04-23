const express = require("express");
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/registration", Validate(registrationSchema), async (req, res) => {
  const { username, password, role } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const usernameMatch = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username],
  );
  if (usernameMatch.row.length > 0) {
    res.status(400).json({ message: "User Already Exist" });

    try {
      const result = await pool.query(
        "INSERT INTO users (username,password,role)  VALUES ($1,$2,$3)",
        [username, password, role],
      );
      res.status(201).json({ message: "Registration Successful" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", errors: error.errors });
    }
  }
});

module.exports = router;
