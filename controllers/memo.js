const {memo} = require('./../DAO/db_model')

module.exports = {
    'GET /memo':async (ctx)=>{
      let {pageSize=10,pageNumber=1} = ctx.query;
      let {rows,count} = await memo.findAndCountAll({limit:pageSize*1,offset:(pageNumber-1)*pageSize})
      ctx.body = {
          code:0,
          list:rows,
          totalNumber:count,
          pageSize,
          pageNumber
      }
     } ,
    'POST /memo':async (ctx)=>{          //添加表单  
      let {createTime,discription,} = ctx.request.body;
      let result = await memo.create({createTime,discription})
      ctx.body = result?{code:0}:{code:1,message:'添加失败'}
    },
    'PUT /memo/:id':async (ctx)=>{
      let { id } = ctx.params;
      let {createTime,discription} = ctx.request.body;
      let [result] = await memo.update({createTime,discription},{where:{id}})
      ctx.body = result>0?{code:0}:{code:1,message:'修改失败'}
    },
    'DELETE /memo/:id':async (ctx)=>{
      let { id } = ctx.params;   
      let result = await memo.destroy({where:{id}})||0;
      ctx.body = result?{code:0}:{code:1,message:'删除失败'};
    }
}
