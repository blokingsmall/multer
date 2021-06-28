const mysql = require('mysql2');
const { Sequelize } = require('sequelize')
const { enrollFrontUrl} = require("./../dev_options.json")

const test_db_config = /test/.test(enrollFrontUrl)?{
  host:'rm-uf6s6om06do7g6zpmvo.mysql.rds.aliyuncs.com',
  user:'form',
  password:'LzRb1pVv^HjL5Ndd',
  enrollUser:'form',
  enrollPassword:'LzRb1pVv^HjL5Ndd',
  enrollDataBase:'test_enroll',
  database:'test_form'
}:{
  host:'rm-uf6s6om06do7g6zpm.mysql.rds.aliyuncs.com',
  enrollUser:'zzh',
  enrollPassword:'MKXDCFq2NIYpDNYVHWMis4qkhN0f5BzH',
  user:'form',
  password:'LzRb1pVv^HjL5Ndd',
  enrollDataBase:'enroll',
  database:'form'
}


const enrollDb = new Sequelize(test_db_config.enrollDataBase,test_db_config.enrollUser,test_db_config.enrollPassword,{
  dialect: 'mysql',
  host: test_db_config.host,
  define:{
    freezeTableName: true,
    charset: 'utf8',
    timestamps: false
  }, 
  pool: {
    max:15,
    idle: 30000,
    acquire: 60000,
  },
})

const sequelize = new Sequelize(test_db_config.database,test_db_config.user,test_db_config.password,{
  host:test_db_config.host,
  dialect: 'mysql',
  define:{
    freezeTableName: true,
    charset: 'utf8',
    timestamps: false
  }, 
  pool: {
    max:15,
    idle: 30000,
    acquire: 60000,
  },
});

 const pool = mysql.createPool({
    host: test_db_config.host,
    user:test_db_config.user,
    password:test_db_config.password,
    database:test_db_config.database,
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0,
 });

  module.exports = {
      enrollDb,
      pool,
      sequelize
  }








