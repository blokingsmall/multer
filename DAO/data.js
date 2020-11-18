const {pool} = require('./db')

const MysqlTable = 'user_data';

const InsertForm = async ({table_key,data,userId,courseId,orderNumber='',createTime = new Date().getTime().toString(),status=1})=>{
    
    return new Promise((resolve,reject)=>{
        pool.query(`INSERT INTO ${MysqlTable} (id,table_key,data,userId,courseId,orderNumber,createTime,status) VALUES (0,'${table_key}','${JSON.stringify(data)}','${userId}','${courseId}','${orderNumber}','${createTime}','${status}')`,(err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                let { affectedRows } = rows;
                if(affectedRows===0){
                    reject({code:1,message:"储存失败"})
                }
                else{
                    resolve({code:0,message:"添加成功"})
                }
            }
        })
    })
}

const getTotalNumber = async (whereStr)=>{

 let totalNumber =  `SELECT COUNT(*) FROM ${MysqlTable} ${whereStr?`WHERE ${whereStr}`:''}`

 return new Promise((resolve,reject)=>{
    pool.query(totalNumber,async (err,rows)=>{
        if(err){
            reject(err)
        }
        else{
            resolve( { totalNumber:rows[0]['COUNT(*)'] } )
        }
    })
})
}

const SelectAll = async ({where,limitConif})=>{
    let whereStr = becomeStr(where)
    let {pageSize,pageNumber} = limitConif;
    let queryStr = `SELECT id,table_key,courseId,userId FROM ${MysqlTable} 
    ${whereStr?`WHERE ${whereStr}`:''}  ORDER BY id DESC LIMIT ${pageSize} OFFSET ${(pageNumber-1)*pageSize} `
    return new Promise((resolve,reject)=>{
        pool.query(queryStr,async (err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                let {totalNumber} = await getTotalNumber(whereStr)
        
                resolve({code:0,data:rows,totalNumber,pageNumber,pageSize})
            }
        })
    })
}

const SelectOne = async ({table_key,column_head,column_value=false})=>{
    let queryStr;
    if(!column_value){
        queryStr = `SELECT JSON_CONTAINS_PATH(data,'one','$.${column_head}') FROM user_data WHERE table_key='${table_key}' AND status='1';  `
    }else{
        queryStr = `SELECT JSON_CONTAINS(data,'${column_value}','$.${column_head}') FROM ${MysqlTable} WHERE table_key='${table_key}' AND status='1';`
    }
    return new Promise((resolve,reject)=>{
        pool.query(queryStr,async (err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                let result = false;
                rows.forEach(i=>{
                    for(let j in i){
                        if(i[j]===1){
                            result = true
                        }
                    }
                })
                console.log(rows)
                resolve({code:0,result:result?result:0})
            }
        })
    })
}

const SelectForm = async ({where,limitConif,type})=>{
    let whereStr = becomeStr(where)
    let queryStr = `SELECT * FROM ${MysqlTable} ${whereStr?`where ${whereStr}`:''}`
    if(limitConif){
        let {pageSize,pageNumber} = limitConif;
        const LimitStr = limitConif?`LIMIT ${pageSize} OFFSET ${(pageNumber-1)*pageSize}`:''
        queryStr+=LimitStr
    }
    return new Promise((resolve,reject)=>{
        pool.query(queryStr,async (err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                resolve({code:0,data:type==='one'?rows[0]:rows})
            }
        })
    })
}

const UpdateForm = async ({data,where})=>{

let whereStr = becomeStr(where)

let str = becomeStr2(data)

return new Promise((resolve,reject)=>{
    pool.query(`UPDATE ${MysqlTable} SET ${str} WHERE ${whereStr} ;`,err=>{
        if(err){
            reject(err)
        }
        else{
            resolve({code:0,message:"修改成功"})
        }
    })
})
}

const DeleteForm = async ({where})=>{

    let whereStr = becomeStr(where)

    return new Promise((resolve,reject)=>{
        pool.query(`DELETE FROM ${MysqlTable} WHERE ${whereStr};`,(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve({code:0,message:"删除成功"})
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
                arr.push(`${i}='${next[i]}'`)
            }
            prev.push(arr.join(' AND '))
            return prev
        },[])
        return narr.join(' OR ')
    }
    for(var i in obj){
        if(obj[i]){
            str+=`${i}='${obj[i]}' AND `
        }
    }
    return str.substr(0,str.length-4);
}

const becomeStr2 = json =>{
    let arr = []
    for(var i in json){
        if(json[i]!==undefined){
            arr.push(`${i}='${typeof json[i]==='object'?JSON.stringify(json[i]): json[i]}'`)
        }
    }
    return arr.join();
}
//json_set(data,"$.address","Guangzhou")



module.exports = {
    pool,
    SelectAll,
    InsertForm,
    SelectForm,
    UpdateForm,
    DeleteForm,
    SelectOne
}





