const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Validate } = require("./middleware");
const pool = require("./DatabaseConfig");

const router = express.Router();

const LoginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

router.post("/login", Validate(LoginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 ",
      [username],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Inavalid username or password" });
    }

    const role = user.role;

    const token = jwt.sign(
      { userId: user.id, username: user.username, role },
      "mumbai",
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ messgae: "Error Logging in", errors: error.error });
  }
});

module.exports = router;
