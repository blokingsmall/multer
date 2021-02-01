const {InsertForm,SelectForm,UpdateForm,DeleteForm,SelectAll} = require('./../DAO/form')

module.exports = {
    'GET /getform':async (ctx)=>{
      let {name,pageSize=10,pageNumber=1,totalNumber=10} = ctx.query;
      let result = await SelectAll({where:{name},limitConif:{pageSize,pageNumber,totalNumber}})
      ctx.body = result
     } ,
    'GET /getform/:id':async (ctx)=>{  //获取表单数据
      let {id} = ctx.params;
      let {name} = ctx.query;
      let reslut = await SelectForm({where:{id,name}});
      ctx.body =  reslut;
    },
    'POST /getform':async (ctx)=>{          //添加表单  
      let { name='',formdata = {source:[]} } = ctx.request.body;//接受表单数据
      let {source} = formdata;
      let arr = source.map(i=>i.formkey)
      let nArr = []
      let flag = [];
      for(let i of arr){
          if(nArr.indexOf(i)===-1){
              nArr.push(i)
          }else{
            flag.push(i)
          }
      }
      if(flag.length){
        ctx.body = {
          code:1,
          message:`表单key存在重复${flag.join()}`
        }
        return;
      }
      if(name===''){
         ctx.body = {
          code:1,
          message:'名称不能为空'
         }
      }
    
      let res = await InsertForm({name,formdata}) // 将数据插入到数据库内
      ctx.body = res; //返回给前端
    },
    'POST /copy_form':async (ctx)=>{          //添加表单  
      let {formId} = ctx.request.body;
      let result = await SelectForm({where:{id:formId}});
      if(result.code!==0){
        ctx.body = {
          code:1,
          message:'没有找到相对于的表单数据'
        }
      }else{
        delete result.data.id
        let res = await InsertForm(result.data);
        ctx.body = {
          code:0,
          data:res
        }
      }
    },
    'PUT /getform/:id':async (ctx)=>{
      let { id } = ctx.params;
      let {name,formdata,rule,max} = ctx.request.body;
      if(formdata&&Object.keys(formdata).length){
        let arr = formdata.source||[].map(i=>i.formkey)
        let nArr = []
        let flag = [];
        for(let i of arr){
            if(nArr.indexOf(i)===-1){
                nArr.push(i)
            }else{
              flag.push(i)
            }
        }
        if(flag.length){
          ctx.body = {
            code:1,
            message:`表单key存在重复${flag.join()}`
          }
          return;
        }
      }
      let result = await UpdateForm({where:{id},data:{name,formdata,rule,max}})
      ctx.body = result;
    },
    'DELETE /getform/:id':async (ctx)=>{
      let { id } = ctx.params;   
      let result = await DeleteForm({where:{id}})
      ctx.body = result;
    }
}
