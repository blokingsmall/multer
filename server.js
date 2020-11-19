
const koa = require('koa');

const cors = require('koa2-cors')

const bodyParser = require('koa-bodyparser')

//const {SelectUserAll} = require('./DAO/user')

const router = require('./router');

const Axios = require('axios')

const {enrollFrontUrl} = require('./dev_options.json')

Axios.interceptors.request.use(config=>{
  config.baseURL = enrollFrontUrl;
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

app.use(cors());

app.use(bodyParser())

app.use(router());
app.listen(/test/g.test(enrollFrontUrl)?8081:8080)

