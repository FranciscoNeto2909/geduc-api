require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Testar conexão
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully...");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });

module.exports = pool;