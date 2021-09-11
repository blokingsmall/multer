const { SelectForm, DeleteForm, SelectAll } = require('./../DAO/form')
const { form } = require('./../DAO/db_model')
module.exports = {
  'GET /getform': async (ctx) => {
    let { name = undefined, pageSize = 10, pageNumber = 1 } = ctx.query;
    let search = name ? { where: { name } } : {}
    let { count, rows } = await form.findAndCountAll({ ...search, offset: (pageNumber - 1) * pageSize, limit: pageSize * 1, order: [['id', 'DESC']] })
    ctx.body = {
      code: 0,
      totalNumber: count,
      pageNumber,
      pageSize,
      data: rows
    }
  },
  'GET /getform/:id': async (ctx) => {  //获取表单数据
    let { id } = ctx.params;
    let { name } = ctx.query;
    let reslut = await SelectForm({ where: { id, name } });
    ctx.body = reslut;
  },
  'POST /getform': async (ctx) => {          //添加表单  
    let { name = '', formdata = { source: [] } } = ctx.request.body;//接受表单数据
    let { source } = formdata;
    let arr = source.map(i => i.formkey)
    let nArr = []
    let flag = [];
    for (let i of arr) {
      if (nArr.indexOf(i) === -1) {
        nArr.push(i)
      } else {
        flag.push(i)
      }
    }
    if (flag.length) {
      ctx.body = {
        code: 1,
        message: `表单key存在重复${flag.join()}`
      }
      return;
    }
    if (name === '') {
      ctx.body = {
        code: 1,
        message: '名称不能为空'
      }
    }

    let res = await form.create({ name, formdata, rule: [] }) // 将数据插入到数据库内
    ctx.body = res.id ? { code: 0 } : { code: 1, message: '添加失败' }; //返回给前端
  },
  'POST /copy_form': async (ctx) => {          //添加表单  
    let { formId } = ctx.request.body;
    let result = await SelectForm({ where: { id: formId } });
    if (result.code !== 0) {
      ctx.body = {
        code: 1,
        message: '没有找到相对于的表单数据'
      }
    } else {
      delete result.data.id
      let res = await form.create(result.data);
      ctx.body = {
        code: 0,
        data: res
      }
    }
  },
  'PUT /getform/:id': async (ctx) => {
    let { id } = ctx.params;
    let { name, formdata, rule, max } = ctx.request.body;
    if (formdata && Object.keys(formdata).length) {
      let arr = formdata.source || [].map(i => i.formkey)
      let nArr = []
      let flag = [];
      for (let i of arr) {
        if (nArr.indexOf(i) === -1) {
          nArr.push(i)
        } else {
          flag.push(i)
        }
      }
      if (flag.length) {
        ctx.body = {
          code: 1,
          message: `表单key存在重复${flag.join()}`
        }
        return;
      }
    }
    let [result] = await form.update({ name, formdata, rule, max }, { where: { id } })
    ctx.body = result ? { code: 0 } : { code: 1, message: '修改失败' };
  },
  'DELETE /getform/:id': async (ctx) => {
    let { id } = ctx.params;
    let result = await DeleteForm({ where: { id } })
    ctx.body = result;
  }
}
