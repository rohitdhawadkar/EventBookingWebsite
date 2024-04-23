const { Pool } = require("pg");

const router = express.router();
const pool = new Pool({
  user: "postgres",
  password: "rohit2002",
  host: "localhost",
  database: "LoginInfo",
  port: 5432,
});

module.exports = router;
