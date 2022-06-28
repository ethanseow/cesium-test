/*
run ubuntu server if local - run heroku redis:cli if
run heroku local to run both server and worker
make sure that we are in cesium conda

make sure that you have scaled the dynos
make sure that you have put python nodejs in buildpack (heroku buildpack) and commit and push to master

tls unauthorized is false for redis connection
parameters are really weird for ioredis - REDISURL,{tls:{rejectUnauthorized:false}}
Queue(queueName needed to talk with worker in constructor, {connection: ioRedisConnection})

await queue.add(needJobName, {data})

in heroku remote by default we can see process.env.{} but in local we need to first require the dotenv package

heroku prod needs to use REDIS_TLS_URL, make sure that anything that ref this env var (.env) is the correct heroku REDIS_TLS_URL

you can see config vars in heroku settings
*/

const express = require('express');
const app = express()
const {Worker, Queue} = require('bullmq')
const Redis = require('ioredis')
const { getDbObject, createNewObject } = require('./singleton')
require('dotenv').config()
//const redis = require("redis");
//const client = redis.createClient({url: process.env.REDIS_URL});

/*
client.on('ready',()=>{
    console.log('redis server is ready')
})

client.on('error',(err)=>{
    console.log(err)
})
*/

const { exec } = require('child_process')

const homeRouters = require('./routes/home');

const PORT = process.env.PORT || 3000


const REDIS_TLS_URL = process.env.REDIS_TLS_URL || 'redis://127.0.0.1:6379'
console.log(REDIS_TLS_URL)
const redisConnection =  new Redis(
    REDIS_TLS_URL,{tls:{rejectUnauthorized:false}}
)
const queue =  new Queue('python-queue',{connection:redisConnection})
app.use(express.json())
app.use(express.static('public'))

app.use('/',homeRouters)

app.post('/satellite', async (req,res,next)=>{
    console.log('received a request')
    const walkerParams = req.body.walkerParams
    // 65 - 122, 0 - 9
    const czmlId = `${Math.floor(Math.random() * 58) + 65}_${Math.floor(Math.random() * 10)}`
    await queue.add('walker_params',{walkerParams:walkerParams,czmlId:czmlId})
    res.send({czmlId:czmlId})
})

app.get('/jobs/:id',(req,res,next) => {
    const{id} = req.params
    const db = getDbObject()
    if(db.hasOwnProperty(id)){
        res.send({finishedProcessing:true,'czmlData':db[id]});
    }else{
        res.send({finishedProcessing:false})
    }
})

app.get('/test-getdbobject',(req,res)=>{
    res.send({db:getDbObject()})
})

app.post('/test-createnewobject',(req,res)=>{
    const {id, data} = req.body
    createNewObject(id,data)
    res.send({db:getDbObject()})
})

app.listen(PORT, async (error)=>{
    /*
    await client.connect()

    await client.set('key', 'value');
    const value = await client.get('key');
    console.log(value)
    */
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})