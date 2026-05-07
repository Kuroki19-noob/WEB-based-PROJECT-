const mysql = require("mysql2/promise")

const mySqlPool = mysql.createPool({
      host:'localhost',
      user:'root',
      password:'mandiemanuel19',
      database:'accountdb'
})

module.exports = mySqlPool;