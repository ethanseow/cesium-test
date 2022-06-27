const express = require("express");
const app = express()
const fs = require('fs')
require('dotenv').config()
app.use(express.json())
app.use(express.static('public'))
TEST_PORT = 5000

const { getDbObject, createNewObject } = require('./singleton')


app.get('/test-getdbobject',(req,res)=>{
    res.send({db:getDbObject()})
})

app.post('/test-createnewobject',(req,res)=>{
    const {id, data} = req.body
    createNewObject(id,data)
    res.send({db:getDbObject()})
})
app.listen(TEST_PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${TEST_PORT}`)
    }
})