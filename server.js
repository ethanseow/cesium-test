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

make sure to run both color redis and primary redis for it all to work
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
const HEROKU_REDIS_YELLOW_TLS_URL = process.env.HEROKU_REDIS_YELLOW_TLS_URL || 'redis://127.0.0.1:6379'
console.log(REDIS_TLS_URL)
const redisConnection =  new Redis(
    REDIS_TLS_URL,{tls:{rejectUnauthorized:false}}
)

const dbRedis = new Redis(HEROKU_REDIS_YELLOW_TLS_URL, {tls:{rejectUnauthorized:false}})

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
    dbRedis.get(id)
    .then((result)=>{
        if(result === null){
            console.log('got no result')
            res.send({finishedProcessing:false})
        }else{
            console.log('got a result')
            console.log(result)
            res.send({finishedProcessing:true,'czmlData':result});
        }
    }).catch((error)=>{
        console.log(error)
        res.send({finishedProcessing:false})
    })
    console.log('after db get request')
})

app.get('/test-getdbobject/:id',(req,res)=>{
    // change this to be query param and not path
    const{id} = req.params
    console.log(id)
    let dbData = null
    let finishedProcessing = false
    dbRedis.get(id)
    .then((result)=>{
        if(result === null){
            console.log('got no result')
        }else{
            console.log('got a result')
            console.log(result)
            finishedProcessing = true
            dbData = result
        }
        console.log('after db get request')
        res.send({finishedProcessing:finishedProcessing,czmlData:dbData})
    }).catch((error)=>{
        console.log(error)
    })

})

app.post('/test-createnewobject',async (req,res)=>{
    const {id, data} = req.body
    await dbRedis.set(id,`this is ${id}`)
    const dbData = await dbRedis.get(id)
    res.send({data:dbData})
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