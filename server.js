const serverDebug = require('debug')('server')
const express = require("express");
const app = express()
const homeRouters = require('./routes/home');
require('dotenv').config()

app.use(express.static('public'))

const { spawn } = require('child_process')

const PORT = process.env.PORT
/*
app.get('/',(req,res,next) => {
    let msg = ''
    const python = spawn('python',['script.py',data])

    python.stdout.on('data',(data) => {
        msg = data.toString()
        serverDebug(msg)
    })
    python.stderr.on('error',(error)=>{
        serverDebug(error)
    })
    python.on('close',()=>{
        res.send({message:msg})
    })
})
*/
app.use('/',homeRouters)
app.get('/satellite',(req,res,next) => {

})

app.listen(PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})