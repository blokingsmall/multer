
const koa = require('koa');

const cors = require('koa2-cors')

const bodyParser = require('koa-bodyparser')

const {SelectUserAll} = require('./DAO/user')

const router = require('./router');

const Axios = require('axios')

Axios.interceptors.request.use(config=>{
  config.baseURL = "https://testadm.houbo.org";
  config.timeout = 300000;
  config.headers["Content-Type"] ="application/json";
  return config
},(err)=>{
  message.error('网络错误');
  return Promise.reject(err)
})


const app = new koa()

// SelectUserAll({usersWhere:[{id:1549956}]}).then(res=>{
//   console.log(res)
// })

app.use(async (ctx,next)=>{
    let {req} = ctx;
    const getUserIp = (req) => {
        return req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
      }
    console.log(getUserIp(req))
    await next()
})

app.use(cors());

app.use(bodyParser())

app.use(router());

app.listen(8080)

