const express = require("express");
const cors = require("cors");

const app = express();
const registerRoute = require("./RegistrationRoute");
const loginRoute = require("Event Booking/backend/LoginRoute/LoginRoute.js");
const bookingRoute = require("./bookings");
const events = require("./events");
app.use(cors());
app.use(express.json());

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", bookingRoute);
app.use("/", events);

const port = 3000;
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
