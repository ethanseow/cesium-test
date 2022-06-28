const { createNewObject } = require('./singleton')
// const Queue = require('bull')
const {Job, Queue, Worker} = require('bullmq')
const Redis = require('ioredis')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const REDIS_URL = process.env.REDIS_URL

const redisConnection =  new Redis(
    REDIS_URL,{tls:{rejectUnauthorized:false}}
)

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
    await exec(command,(error,stdout,stderr)=>{
      console.log(stdout)
      console.log(czmlId)
        return({
            czmlId:czmlId,
            czmlData:stdout,
            'error':error,
            'stderr':stderr
        });
    })
  },
  {
connection:redisConnection
  }
) 

worker.on('completed',async(job,result)=>{
    const { czmlId, czmlData } = result

    console.log('completed in server side')
    console.log(czmlId);
    console.log(czmlData)

    // czmlData exists in result obj, but not creating new object
    // perhaps has to do with different database?
    createNewObject(czmlId,czmlData)
});