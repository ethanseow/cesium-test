const express = require('express');
const app = express()
const Queue = require('bull')

const { exec } = require('child_process')

const homeRouters = require('./routes/home');

const PORT = process.env.PORT || 3000
const REDIS_URL = process.env.REDIS_URL || '127.0.0.1:6379'

let workQueue = Queue(REDIS_URL)

let db = {}


app.use(express.json())
app.use(express.static('public'))

app.use('/',homeRouters)

app.post('/satellite', (req,res,next)=>{
    console.log('received a request')
    const walkerParams = req.body.walkerParams
    // 65 - 122, 0 - 9
    const czmlId = `${Math.floor(Math.random() * 58) + 65}_${Math.floor(Math.random() * 10)}`
    const job = workQueue.add({walkerParams:walkerParams,czmlId:czmlId})
    res.send({czmlId:czmlId})
})

app.get('/jobs/:id',(req,res,next) => {
    const{id} = req.params
    if(db.hasOwnProperty(id)){
        res.send({finishedProcessing:true,'czmlData':db[id]});
    }else{
        res.send({finishedProcessing:false})
    }
})

app.listen(PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})

module.exports = {db:db}