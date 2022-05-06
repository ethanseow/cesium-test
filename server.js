const express = require("express");
const app = express()
const homeRouters = require('./routes/home');

require('dotenv').config()
app.use(express.json())
app.use(express.static('public'))
const { spawn } = require('child_process')
const PORT = process.env.PORT

const dummyCzml = [
  {
    id: "document",
    name: "CZML Geometries: Rectangle",
    version: "1.0",
  },
  {
    rectangle: {
      coordinates: {
        wsenDegrees: [-120, 40, -110, 50],
      },
      fill: true,
      material: {
        solidColor: {
          color: {
            rgba: [255, 0, 0, 255],
          },
        },
      },
    },
  },
  {
    rectangle: {
      coordinates: {
        wsenDegrees: [-110, 40, -100, 50],
      },
      fill: true,
      material: {
        solidColor: {
          color: {
            rgba: [0, 0, 255, 255],
          },
        },
      },
    },
  },
];
app.use('/',homeRouters)
app.post('/satellite',(req,res,next) => {
    const {dummy1, dummy2, dummy3} = req.body
    let msg = ''
    console.log(req.body)
    const python = spawn('python',['script.py',dummy1,dummy2,dummy3])
    python.stdout.on('data',(data) => {
        msg = data.toString()
    })
    python.on('close',()=>{
        res.json({msg:msg,czml:dummyCzml})
    })
})

app.listen(PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})