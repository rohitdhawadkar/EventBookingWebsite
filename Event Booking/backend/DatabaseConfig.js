const { pool } = require("pg");

const router = express.router();
const Pool = new pool({
  user: "postgres",
  password: "rohit2002",
  host: "localhost",
  database: "LoginInfo",
  port: 5432,
});

module.exports = router;
