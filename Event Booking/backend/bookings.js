const express = require("express");
const { VerifyToken, checkRole } = require("./middleware");
const pool = require("./DatabaseConfig");

const router = express.Router();

router.post("/bookings", VerifyToken, checkRole("user"), async (req, res) => {
  const { username, EventTitle, EventId, quantity } = req.body;
  try {
    const eventExists = await pool.query(
      "SELECT * FROM events WHERE EventTitle = $1",
      [EventId],
    );

    if (eventExists.rows.length === 0) {
      return res.status(404).json({ message: "Event Not found" }); // Change status code to 404 for Not Found
    }

    const SeatsAvailable = eventExists.rows[0].SeatsAvailable;
    if (quantity > SeatsAvailable) {
      return res.status(400).json({ message: "Not enough seats" }); // Change status code to 400 for Bad Request
    }

    const userExists = await pool.query(
      // Changed variable name to userExists
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (userExists.rows.length === 0) {
      // Fixed condition
      return res.status(404).json({ message: "User does not exist" }); // Change status code to 404 for Not Found
    }

    await pool.query(
      "INSERT INTO bookings (username, EventTitle, EventId, quantity) VALUES ($1, $2, $3, $4)",
      [username, EventTitle, EventId, quantity],
    );

    await pool.query(
      "UPDATE events SET SeatsAvailable = SeatsAvailable - $1 WHERE id = $2",
      [quantity, EventId],
    );

    res.status(201).json({ message: "Booking Created Successfully" }); // Change status code to 201 for Created
  } catch (error) {
    res.status(500).json({ message: "Error while booking" }); // Change status code to 500 for Internal Server Error
  }
});

module.exports = router;
