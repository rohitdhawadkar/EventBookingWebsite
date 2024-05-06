const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { Validate } = require("./middleware");
const pool = require("./DatabaseConfig");

const router = express.Router();

const registerSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
  role: z.string(),
});

router.post("/registration", Validate(registerSchema), async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const usernameMatch = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (usernameMatch.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [username, passwordHash, role],
    );

    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

module.exports = router;
