const express = require('express');
const app = express()
const Queue = require('bull')

const PORT_TEST = process.env.PORT_TEST
const REDIS_URL = process.env.REDIS_URL || '127.0.0.1:6379'

let workQueue = Queue(REDIS_URL)

workQueue.process((job,done)=>{
    done(null,job.data);
});

workQueue.on('completed',(job,result)=>{
    console.log(`event completed callback-job:${job}`);
    console.log(`event completed callback-result:${result}`)
});

app.use(express.json())
app.use(express.static('public'))

app.post('/test-exec',async (req,res,next)=>{
    const walkerParams = req.body.walkerParams
    const job = await workQueue.add(walkerParams)
    res.send
})

app.listen(PORT_TEST, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})