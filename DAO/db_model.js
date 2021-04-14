const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('form','form','LzRb1pVv^HjL5Ndd',{
    host:'rm-uf6s6om06do7g6zpm.mysql.rds.aliyuncs.com',
    dialect:'mysql'
});

const memo = sequelize.define('memos',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        defaultValue:0
    },
    discription:{
        type:DataTypes.STRING,
        allowNull:true
    },
    createTime:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:false
})


module.exports = {
    memo
}

