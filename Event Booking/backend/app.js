const express = require("express");
const cors = require("cors");

const app = express();
const registerRoute = require("./RegistrationRoute");
const loginRoute = require("./LoginRoute");
const bookingRoute = require("./bookings");
app.use(cors());
app.use(express.json());

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", bookingRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
