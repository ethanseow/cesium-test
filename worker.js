const { createNewObject } = require('./singleton')
const Queue = require('bull')

const { exec } = require('child_process')

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'


let workQueue = Queue(REDIS_URL)
workQueue.process((job,done)=>{
    console.log('job added')
    const { walkerParams, czmlId } = job.data
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
    
    exec(command,(error,stdout,stderr)=>{
        done(null,{
            czmlId:czmlId,
            czmlData:stdout,
            'error':error,
            'stderr':stderr
        });
    })
    
    
});

workQueue.on('completed',(job,result)=>{

    const { czmlId, czmlData } = result

    console.log('completed in server side')
    console.log(czmlId);
    console.log(czmlData)

    // czmlData exists in result obj, but not creating new object
    // perhaps has to do with different database?
    createNewObject(czmlId,czmlData)
});