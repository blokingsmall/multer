const mysql = require('mysql2');
//rm-uf6s6om06do7g6zpm.mysql.rds.aliyuncs.com 正式环境
//rm-uf6s6om06do7g6zpmvo.mysql.rds.aliyuncs.com //测试环境
 const pool = mysql.createPool({
    host: 'rm-uf6s6om06do7g6zpmvo.mysql.rds.aliyuncs.com',
    user: 'form',
    password:'LzRb1pVv^HjL5Ndd',
    database: 'test_form',
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
  });
  const userPool = mysql.createPool({
    host: 'rm-uf6s6om06do7g6zpmvo.mysql.rds.aliyuncs.com',
    user: 'form',
    password:'LzRb1pVv^HjL5Ndd',
    database: 'test_enroll',
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
  });
  module.exports = {
      pool,
      userPool
  }








