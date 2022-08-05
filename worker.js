const {Worker} = require('bullmq')
const Redis = require('ioredis')
const {exec} = require('child_process');
require('dotenv').config()

const REDIS_TLS_URL = process.env.REDIS_TLS_URL || 'redis://127.0.0.1:6379'
const HEROKU_REDIS_YELLOW_TLS_URL = process.env.HEROKU_REDIS_YELLOW_TLS_URL || 'redis://127.0.0.1:6379'

const redisConnection =  new Redis(REDIS_TLS_URL,{tls:{rejectUnauthorized:false}})

const dbRedis = new Redis(HEROKU_REDIS_YELLOW_TLS_URL, {tls:{rejectUnauthorized:false}})

const worker = new Worker('python-queue' ,async (job)=>{
    let { walkerParams, czmlId } = job.data
    const parseBody = (json) => {
      //console.log(json)
      let stringifiedJSON = JSON.stringify(json)
      let ret = ''
      for(var i = 0;i < stringifiedJSON.length;i++){
        if (stringifiedJSON[i] == '"'){
          ret += "\\"
        }
        ret += stringifiedJSON[i]
      }
      return ret
    }
    const preprocessedParams = parseBody(walkerParams)

    const command = `python ./SatLib2/webScript.py ${preprocessedParams}`
    exec(command,(error,stdout,stderr)=>{
      dbRedis.set(czmlId,stdout)
      //console.log('done')
      //console.log(stdout)
      //console.log(error)
      //console.log(stderr)
      return 
    })
  },{connection:redisConnection}
) 


worker.on('failed',(job,error)=>{
  console.log(error)
})