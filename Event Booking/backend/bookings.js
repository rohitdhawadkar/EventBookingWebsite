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
      return res.status(404).json({ message: "Event Not found" });
    }

    const SeatsAvailable = eventExists.rows[0].SeatsAvailable;
    if (quantity > SeatsAvailable) {
      return res.status(400).json({ message: "Not enough seats" });
    }

    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    await pool.query(
      "INSERT INTO bookings (username, EventTitle, EventId, quantity) VALUES ($1, $2, $3, $4)",
      [username, EventTitle, EventId, quantity],
    );

    await pool.query(
      "UPDATE events SET SeatsAvailable = SeatsAvailable - $1 WHERE id = $2",
      [quantity, EventId],
    );

    res.status(201).json({ message: "Booking Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while booking" });
  }
});

router.get(
  "/bookings/user/:id",
  VerifyToken,
  checkRole("user"),
  async (req, res) => {
    const { id } = req.params.id;

    try{
      const result = await pool.query("SELECT * FROM bookings WHERE username = $1 ",[id]);
      if(result.rows.length===0){
        res.status(400).json({message:"No Bookings"});
      }
      res.json(result.rows);

    }catch(error){
      res.status.(400).json({message:"Error Occured",errors:error.errors});
    }


  }
);

router.delete("/bookings/:id",VerifyToken,checkRole("user"),async (req,res)=>{
  const {id} = req.params.id;
  try{

       const result = await pool.query("SELECT * FROM bookings where BookingId = $1 ",[id]);
        if(result.rows.length===0){
        res.status(400).json({message:"Booking not found"});
        }
     const eventId = result.rows[0].Id;
     const quantity = result.rows[0].quantity;

     const update = await pool.query("UPDATE events SET tickets_available = tickets_available + $1 WHERE id = $2",[quantity,eventId]);
      const del = await pool.query("DELETE FROM bookings WHERE id = $1",[id]);
      res.json({message:"Booking Deleted Successfully"});
  }

     catch(error){
       res.status(400).json({message:"Error while deleting booking",errors:error.errors});
     }

  },
});

module.exports = router;
