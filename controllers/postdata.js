const { SelectForm, UpdateForm, DeleteForm, SelectOne } = require('./../DAO/data.js')
const { user, delivery_address, cctalk_user, user_data, form, Op } = require('./../DAO/db_model')
const Axios = require('axios');
const { backendUrl } = require('./../dev_options.json')

module.exports = {
    'GET /form_fields': async (ctx) => {
        let { orderNumber, userId } = ctx.query;
        let { data } = await SelectForm({ where: { userId, orderNumber, status: 1 } });
        ctx.body = Object.keys(data).length ? { code: 1 } : { code: 0 }
    },
    'GET /test_fields': async ctx => {
        let { table_key, column_head, column_value } = ctx.query;
        let result = await SelectOne({ table_key, column_head, column_value })
        ctx.body = result
    },
    'GET /data_fields': async (ctx) => {
        let { table_key, userId, orderNumber } = ctx.query;
        let resBody = {}
        try {
            let reslut = await SelectForm({ where: { table_key, userId, orderNumber, status: 1 }, type: 'one' });
            resBody = reslut
        }
        catch (err) {
            resBody = {
                code: 1,
                message: '系统错误'
            }
        }
        ctx.body = resBody;
    },
    'POST /getform_data': async ctx => {
        let { formId } = ctx.request.body;
        let { headers } = ctx;
        let res = await Axios({
            method: 'get',
            url: `${backendUrl}/enrolment_form_logs/${formId}`,
            params: { pageSize: 99999 },
            headers: { Authorization: headers["authorization"] }
        })
        if (res.data.code !== 0) {
            ctx.body = {
                code: 1,
                message: '错误'
            }
        }
        else {
            //SelectUserAll
            let searchId = []
            let searchArr = []
            res.data.data.list.forEach(i => {
                searchArr.push({ orderNumber: i.orderNumber, userId: i.userId, status: 1 })
                searchId.push(i.userId)
            })
            let userResult = await user.findAll({
                attributes: ['id', 'major', 'graduatedSchoolCode', 'gender', 'emailAddress', 'birthDate', 'nickname', 'qqNumber', 'mobileNumber'],
                include: [
                    {
                        model: delivery_address,
                        required: false,
                        attributes: ['consignee', 'fullAddress', 'phoneNumber', 'postalCode', 'region'],
                        where: {
                            status: 1
                        }
                    },
                    {
                        model: cctalk_user, attributes: ['rollNumber']
                    }
                ], where: { id: searchId }
            })

            let connectionData = userResult.map(i => i.toJSON())

            let result = await form.findOne({
                include: {
                    model: user_data,
                    required: false,
                    where: { [Op.or]: searchArr }
                },
                where: { id: formId }
            })
            let { user_data: formData, formdata = {} } = result.toJSON()
            let newList = res.data.data.list.map((i) => {
                let json = formData.find(j => j.userId === i.userId).data;
                delete json.delivery_addresses
                delete json.personInfo
                return { ...i, ...json, ...connectionData.find(j => j.id === i.userId), id: i.id }
            })
            let filterArr = ['discription', 'upload']
            ctx.body = { code: 0, data: newList, form_colums: formdata.source.filter(i => !filterArr.includes(i.type)) }

        }
    },
    'POST /form_fields': async (ctx) => {
        let { table_key, data = {}, userId, courseId, orderNumber = 'testorder', token } = ctx.request.body;
        await UpdateForm({ where: { userId, orderNumber }, data: { status: 0 } })
        let Authorization = `Bearer ${token}`
        let { delivery_addresses = {}, personInfo = {} } = data;
        Object.keys(delivery_addresses).forEach(i => {
            if (!delivery_addresses[i]) {
                delete delivery_addresses[i]
            }
        })
        Object.keys(personInfo).forEach(i => {
            if (!personInfo[i]) {
                personInfo[i] !== 0 && delete personInfo[i]
            }
        })
        if (Object.keys(personInfo).length > 0) {
            try {
                var editRuslt = await Axios.put('/profile', personInfo, { headers: { Authorization } })
                if (editRuslt.data.code !== 0) {
                    ctx.body = editRuslt.data;
                    return;
                }
            } catch (err) {
                ctx.body = {
                    code: 1,
                    message: '后台服务错误'
                }
            }
        }
        if (Object.keys(delivery_addresses).length > 0) {
            if (delivery_addresses.fullAddress) {
                delivery_addresses.fullAddress = unescape(delivery_addresses.fullAddress)
            }
            if (delivery_addresses.id) {
                editRuslt = await Axios.put(`/delivery_addresses/${delivery_addresses.id}`, delivery_addresses, { headers: { Authorization } })
            }
            else {
                editRuslt = await Axios.post(`/delivery_addresses`, delivery_addresses, { headers: { Authorization } })
            }
        }
        res = await user_data.create({ data, table_key, userId, courseId, orderNumber, status: 1, createTime: +new Date() })
        ctx.body = res ? { code: 0 } : { code: 1, message: '添加失败' };
    },
    'PUT /form_fields/:id': async (ctx) => {
        let { id } = ctx.params;
        let { data = {} } = ctx.request.body;
        let res = await UpdateForm({ where: { id, status: 1 }, data: { data } })
        ctx.body = res;
    },
    'DELETE /form_fields/:id': async (ctx) => {
        let { id } = ctx.params;
        let res = await DeleteForm({ where: { id, status: 1 } })
        ctx.body = res;
    }
}

