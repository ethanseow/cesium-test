const { createNewObject } = require('./singleton')
// const Queue = require('bull')
const {Job, Queue, Worker, RedisConnection} = require('bullmq')
const Redis = require('ioredis')
const util = require('util')
const { resolve } = require('path')
const exec = util.promisify(require('child_process').exec)
require('dotenv').config()

const REDIS_TLS_URL = process.env.REDIS_TLS_URL || 'redis://127.0.0.1:6379'
const HEROKU_REDIS_YELLOW_TLS_URL = process.env.HEROKU_REDIS_YELLOW_TLS_URL || 'redis://127.0.0.1:6379'

const redisConnection =  new Redis(
    REDIS_TLS_URL,{tls:{rejectUnauthorized:false}}
)

const dbRedis = new Redis(HEROKU_REDIS_YELLOW_TLS_URL, {tls:{rejectUnauthorized:false}})

const worker = new Worker('python-queue' ,async (job)=>{
    console.log('job added')
    let { walkerParams, czmlId } = job.data
    console.log(walkerParams)
    const parseBody = (json) => {
      console.log(json)
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

    const command = `python ./SatLib/walker_script.py ${preprocessedParams}`
    //done(null,{czmlId:czmlId,czmlData:'stdout here', 'stderr':'stderr here', 'error':'error here'})
    console.log(command)
    // exec needs await?
    exec(command,(error,stdout,stderr)=>{
      // console.log(stdout)
      // console.log(czmlId)
      //console.log(stderr)
      console.log('completed the command')
      dbRedis.set(czmlId,stdout)
      return {czmlId:'123',czmlData:'data'}
    })
  },{connection:redisConnection}
) 


worker.on('failed',(job,error)=>{
  console.log(error)
})