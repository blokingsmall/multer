const {InsertForm,SelectForm,UpdateForm,DeleteForm,SelectOne} = require('./../DAO/data.js')
const FormData = require('./../DAO/form')
const {SelectUserAll} = require('./../DAO/user')
const Axios = require('axios');
const {backendUrl} = require('./../dev_options.json')

module.exports = {
    // 'GET /form_fields':async (ctx)=>{
    //     let {id,table_key,orderNumber,courseId,userId,pageSize=10,pageNumber=1,totalNumber=10} = ctx.query;
    //     let result = await SelectAll({where:{id,orderNumber,table_key,courseId,userId,status:1},limitConif:{pageSize,pageNumber,totalNumber}})
    //     ctx.body = result;
    // },
    'GET /form_fields':async (ctx)=>{
        let {orderNumber,userId} = ctx.query;
        let {data} = await SelectForm({where: {userId,orderNumber,status:1}});
        ctx.body = Object.keys(data).length?{code:1}:{code:0}
    },
    'GET /test_fields':async ctx =>{
        let {table_key,column_head,column_value} = ctx.query;
        let result = await SelectOne({table_key,column_head,column_value})
        ctx.body = result
    },
    'GET /data_fields':async (ctx)=>{  
        let {table_key,userId,orderNumber} = ctx.query;
        let resBody = {}  
        try{
            let reslut = await SelectForm({where:{table_key,userId,orderNumber,status:1},type:'one'});
            resBody = reslut
        }
        catch(err){
            resBody = {
                code:1,
                message:'系统错误'
            }
        } 
        ctx.body =  resBody;
    },
    'POST /getform_data':async ctx=>{
        let {formId} = ctx.request.body;
        let {headers} = ctx;
        let res = await Axios({
          method:'get',
          url:`${backendUrl}/enrolment_form_logs/${formId}`,
          params:{pageSize:99999},
          headers:{Authorization:headers["authorization"]}
        })
        if(res.data.code!==0){
            ctx.body = {
                code:1,
                message:'错误'
            }
        }
        else{
            //SelectUserAll
            let searchId = []
            let searchArr = []
            res.data.data.list.forEach(i=>{
                searchArr.push({orderNumber:i.orderNumber,userId:i.userId,status:1})
                searchId.push({id:i.userId})
            })
            let nDate = new Date().getTime()
            let connectionData = await SelectUserAll({usersWhere:searchId})
            console.log('第一次请求数据时间为',new Date().getTime() - nDate)
            let sDate = new Date().getTime()
            let result = await SelectForm({where:searchArr})
            console.log('第二次单次请求数据时间为',new Date().getTime() - sDate)
            let form_colums = await FormData.SelectForm({where:{id:formId}})
            if(result.code===0&&connectionData.code===0){
                let newList = res.data.data.list.map((i,index)=>{
                    let json = result.data[index]?result.data[index].data:{}
                    delete json.delivery_addresses
                    delete json.personInfo
                    return {...i,...json,id:i.id,...connectionData.data.filter(j=>j.userId===i.userId)[0]}
                })
                let filterArr =['discription','upload']
                ctx.body = {code:0,data:newList,form_colums:form_colums.data.formdata.source.filter(i=>!filterArr.includes(i.type))}
            }
            else{
                ctx.body = {code:1,message:'数据不一致，请联系管理员'}
            }
        }
      } , 
    'POST /form_fields':async (ctx)=>{      
        let { table_key,data={},userId,courseId,orderNumber='testorder',token} = ctx.request.body;
        await UpdateForm({where:{userId,orderNumber},data:{status:0}}) 
        let Authorization = 'Bearer '+token
        let {delivery_addresses={},personInfo={}} =  data;
        Object.keys(delivery_addresses).forEach(i=>{
            if(!delivery_addresses[i]){
                delete delivery_addresses[i]
            }
        })
        Object.keys(personInfo).forEach(i=>{
            if(!personInfo[i]){
                personInfo[i]!==0&&delete personInfo[i]
            }
        })
        if(Object.keys(personInfo).length>0){
            try{
                var editRuslt = await Axios.put('/profile',personInfo,{headers:{Authorization}})
                if(editRuslt.data.code!==0){
                    ctx.body = editRuslt.data; 
                    return;
                }
            }catch(err){
                ctx.body = {
                    code:1,
                    message:'后台服务错误'
                }
            }
        }
        if(Object.keys(delivery_addresses).length>0){
            var editRuslt = {};
            try{
                if(delivery_addresses.id){
                    editRuslt = await Axios.put(`/delivery_addresses/${delivery_addresses.id}`,delivery_addresses,{headers:{Authorization}})
                }
                else{
                    editRuslt = await Axios.post(`/delivery_addresses`,delivery_addresses,{headers:{Authorization}})
                }
            }
            catch(err){
                ctx.body = {
                    code:1,
                    message:'后台服务错误'
                }
            }
            if(editRuslt.data.code!==0){
                ctx.body = editRuslt.data; 
                return;
            }
        }
        ctx.body = {
            code:1,
        }
        res = await InsertForm({data,table_key,userId,courseId,orderNumber}) 
        ctx.body = res; 
    },
    'PUT /form_fields/:id':async (ctx)=>{
        let {id} = ctx.params;
        let { data={}} = ctx.request.body;
        let res = await UpdateForm({where:{id,status:1},data:{data}}) 
        ctx.body = res; 
    },
    'DELETE /form_fields/:id':async (ctx)=>{
        let {id} = ctx.params;
        let res = await DeleteForm({ where:{id,status:1} }) 
        ctx.body = res; 
    }
}