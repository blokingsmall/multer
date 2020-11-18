const {pool} = require('./db')
const MysqlTable = 'test';
const InsertForm = async ({name,formdata})=>{
    return new Promise((resolve,reject)=>{
        pool.query(`INSERT INTO ${MysqlTable} (id,name,formdata,rule) VALUES (0,'${name}','${JSON.stringify(formdata)}','[]')`,(err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                let { affectedRows,insertId } = rows;

                if(affectedRows===0){
                    reject({code:1,message:"储存失败"})
                }
                else{
                    resolve({code:0,message:"添加成功",id:insertId})
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
    let queryStr = `SELECT id,name FROM ${MysqlTable} ${whereStr?`WHERE ${whereStr}`:''} ORDER BY id DESC LIMIT ${pageSize} OFFSET ${(pageNumber-1)*pageSize} `
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

const SelectForm = async ({where,limitConif})=>{
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
                    resolve({code:0,data:rows[0]||{}})
                }
            })
        })
}

const UpdateForm = async ({data,where})=>{

    let whereStr = becomeStr(where)

    let str = becomeStr2(data)

    return new Promise((resolve,reject)=>{
        pool.query(`UPDATE ${MysqlTable} SET ${str} WHERE ${whereStr}`,err=>{
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
        pool.query(`DELETE FROM ${MysqlTable} WHERE ${whereStr};`,(err,rows)=>{
            if(err){
                reject(err)
            }
            else{
                resolve({code:0,message:"删除成功"})
            }
        })
    })

}

const becomeStr = json =>{
    let str = ''
    for(var i in json){
        if(json[i]){
            str+=`${i}='${json[i]}' AND `
        }
    }
    return str.substr(0,str.length-4);
}
const becomeStr2 = json =>{
    let arr = []
    for(var i in json){
        if(json[i]){
            arr.push(`${i}='${typeof json[i]==='object'?JSON.stringify(json[i]):json[i]}'`)
        }
    }
    return arr.join();
}




module.exports = {
    SelectAll,
    InsertForm,
    SelectForm,
    UpdateForm,
    DeleteForm
}