const express = require("express");
const cors = require("cors");

const app = express();
const registerRoute = require("./RegistrationRoute");
const loginRoute = require("./LoginRoute");
app.use(cors());
app.use(express.json());

app.use("/", registerRoute);
app.use("/", loginRoute);

const port = 8000;
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
