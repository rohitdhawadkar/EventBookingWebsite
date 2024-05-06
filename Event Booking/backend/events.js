const express = require("express");
const pool = require("./DatabaseConfig");
const { VerifyToken, checkRole } = require("./middleware");

const router = express.Router();

router.post(
  "/events",
  VerifyToken,
  checkRole("organiser"),
  async (req, res) => {
    const {
      eventtitle,
      eventdescription,
      eventdate,
      eventlocation,
      seatsavailable,
      ticketprice,
    } = req.body;

    try {
      const result = await pool.query(
        "SELECT * FROM events WHERE eventtitle = $1",
        [eventtitle],
      );

      if (result.rows.length > 0) {
        return res.status(400).json({ message: "Event already exists" });
      }

      await pool.query(
        "INSERT INTO events (eventtitle, eventdescription, eventdate, eventlocation, seatsavailable, ticketprice) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          eventtitle,
          eventdescription,
          eventdate,
          eventlocation,
          seatsavailable,
          ticketprice,
        ],
      );

      res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({
        message: "Error occurred during event creation",
        errors: error.errors,
      });
    }
  },
);

router.get("/events", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.status(400).json(result.rows);
  } catch (error) {
    res.status(400).json({
      message: "error occured while fetching events",
      errors: error.errors,
    });
  }
});

module.exports = router;
