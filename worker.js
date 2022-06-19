const {db} = require('./server')
const Queue = require('bull')

const { exec } = require('child_process')

const REDIS_URL = process.env.REDIS_URL || '127.0.0.1:6379'


let workQueue = Queue(REDIS_URL)
workQueue.process((job,done)=>{
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

    // change to run walker script
    const command = `python ./SatLib/walker_script.py ${preprocessedParams}`
    // done(null,{czmlId:czmlId,czmlData:'stdout here', 'stderr':'stderr here', 'error':'error here'})
    
    exec(command,(error,stdout,stderr)=>{
        console.log(`Error:${error}`)
        console.log(`Stdout:${stdout}`)
        console.log(`Stderr:${stderr}`)
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
    // console.log(result);
    db = {...db, [czmlId]:czmlData}
});