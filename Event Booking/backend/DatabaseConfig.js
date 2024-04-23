const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "EventBookingDB",
  password: "rohit2002",
  port: 5433,
});

module.exports = pool;
