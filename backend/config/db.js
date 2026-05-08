const mysql = require("mysql2/promise")
require('dotenv').config()

const mySqlPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "accountdb",
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false // Change to true and provide CA if you want to verify the server certificate
  } : null,
  waitForConnections: true,
  connectionLimit: 10
})

module.exports = mySqlPool
