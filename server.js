const serverDebug = require('debug')('server')
const express = require("express");
const app = express()
require('dotenv').config()
const { spawn } = require('child_process')

const PORT = process.env.PORT

app.get('/',(req,res,next) => {
    let msg = ''
    const python = spawn('python',['script.py'])

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

app.listen(PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})