const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { zod } = require("zod");

const router = express.Router();

const Validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Invalid request body", errors: error.errors });
    }
  };
};

const LoginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

router.post("/login", Validate(LoginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Inavalid username or password" });
    }

    const role = user.role;

    const token = jwt.sign({ userId: user.id, role }, "rohit2002");

    res.json({ token });
  } catch (error) {
    res.status(500).json({ messgae: "Error Logging in", errors: error.error });
  }
});

