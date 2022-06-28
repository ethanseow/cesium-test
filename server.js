/*
run ubuntu server if local - run heroku redis:cli if
run heroku local to run both server and worker
make sure that we are in cesium conda

make sure that you have scaled the dynos
make sure that you have put python nodejs in buildpack (heroku buildpack) and commit and push to master
*/

const express = require('express');
const app = express()
const Queue = require('bull')
const { getDbObject, createNewObject } = require('./singleton')
require('dotenv').config()
const redis = require("redis");
const client = redis.createClient({url: process.env.REDIS_URL});


client.on('ready',()=>{
    console.log('redis server is ready')
})

client.on('error',(err)=>{
    console.log(err)
})

const { exec } = require('child_process')

const homeRouters = require('./routes/home');

const PORT = process.env.PORT || 3000


const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
console.log(REDIS_URL)
let workQueue = Queue(REDIS_URL)
app.use(express.json())
app.use(express.static('public'))

app.use('/',homeRouters)

app.post('/satellite', async (req,res,next)=>{
    console.log('received a request')
    const walkerParams = req.body.walkerParams
    // 65 - 122, 0 - 9
    const czmlId = `${Math.floor(Math.random() * 58) + 65}_${Math.floor(Math.random() * 10)}`
    const job = workQueue.add({walkerParams:walkerParams,czmlId:czmlId})
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