const {  DataTypes  } = require('sequelize');

const {enrollDb,sequelize} = require('./db')


const delivery_address = exports.delivery_address = enrollDb.define('delivery_address',{
    userId:DataTypes.NUMBER,
    consignee:DataTypes.STRING,
    phoneNumber:DataTypes.STRING,
    postalCode:DataTypes.STRING,
    region:DataTypes.STRING,
    fullAddress:DataTypes.STRING,
    consignee:DataTypes.STRING,
    createTime:DataTypes.NUMBER,
    status:DataTypes.TINYINT
})

const cctalk_user = exports.cctalk_user = enrollDb.define('cctalk_user',{
    userId:DataTypes.NUMBER,
    rollNumber:DataTypes.STRING,
    openAccessToken:DataTypes.STRING,
    createTime:DataTypes.NUMBER,
    expireTime:DataTypes.NUMBER,
    openRefreshToken:DataTypes.STRING,
})

const user = exports.user = enrollDb.define('user',{
    phoneNumber:DataTypes.STRING,
    emailAddress:DataTypes.STRING,
    gender:DataTypes.TINYINT,
    userPwd:DataTypes.STRING,
    source:DataTypes.STRING,
    birthDate:DataTypes.BIGINT,
    avatar:DataTypes.STRING,
    nickname:DataTypes.STRING,
    qqNumber:DataTypes.BIGINT,
    mobileNumber:DataTypes.STRING,
    actualGender:DataTypes.TINYINT,
    actualBirthDate:DataTypes.BIGINT,
    createTime:DataTypes.NUMBER,
    status:DataTypes.TINYINT,
    graduatedSchoolCode:DataTypes.STRING,
    major:DataTypes.STRING,
},{
    indexes:[{unique:true,fields:['phoneNumber']}]
})

user.belongsTo(cctalk_user,{
    foreignKey:'id',
    targetKey:'userId'
})
user.belongsTo(delivery_address,{
    foreignKey:'id',
    targetKey:'userId'
})


 exports.memo =  sequelize.define('memos',{
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
