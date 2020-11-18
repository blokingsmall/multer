const {userPool} = require('./db')
const userTable = 'user';
const addressTable = 'delivery_address'
const cctalk_userTable = 'cctalk_user'


// const getTotalNumber = async (whereStr)=>{
    
//     let totalNumber =  `SELECT COUNT(*) FROM ${MysqlTable} ${whereStr?`WHERE ${whereStr}`:''}`
    
//     return new Promise((resolve,reject)=>{
//         pool.query(totalNumber,async (err,rows)=>{
//             if(err){
//                 reject(err)
//             }
//             else{
//                 resolve( { totalNumber:rows[0]['COUNT(*)'] } )
//             }
//         })
//     })
// }

const SelectUserAll = async ({usersWhere})=>{ //limitConif
    let whereStr = becomeStr(usersWhere)
  //let {pageSize,pageNumber} = limitConif;
  //SELECT * FROM cctalk_user as a INNER JOIN user as b ON a.userId = b.id WHERE a.userId=1549956;
    let queryStr = `SELECT 
    users.major,users.graduatedSchoolCode,users.gender,users.emailAddress,users.birthDate,users.nickname,users.qqNumber,users.mobileNumber,cctalk.rollNumber,
    address.*
    FROM ${userTable} as users  INNER JOIN ${addressTable} as address INNER JOIN ${cctalk_userTable} as cctalk ON 
    users.id = address.userId OR users.id = cctalk.userId
     ${whereStr?`WHERE ${whereStr}`:''} `
      //ORDER BY id DESC LIMIT ${pageSize} OFFSET ${(pageNumber-1)*pageSize}
      return new Promise((resolve,reject)=>{
        userPool.query(queryStr,async (err,rows)=>{
            if(err){
                reject(err)
            }
            else{
             //   let {totalNumber} = await getTotalNumber(whereStr)
                resolve({code:0,data:rows})
            }
        })
    })
}

const becomeStr = obj =>{
    let str = ''
    if(Array.isArray(obj)){
        var narr = obj.reduce((prev,next)=>{
            let arr = []
            for(var i in next){
                arr.push(`users.${i}='${next[i]}' AND users.status = '1' AND address.status = '1' `)
            }
            prev.push(arr.join(' AND '))
            return prev
        },[])
        return narr.join(` OR `)
    }
    for(var i in obj){
        if(obj[i]){
            str+=`${i}='${obj[i]}' AND `
        }
    }
    return str.substr(0,str.length-4);
}

module.exports = {
    SelectUserAll,
}