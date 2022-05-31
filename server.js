const express = require("express");
const app = express()
const homeRouters = require('./routes/home');
const fs = require('fs')
require('dotenv').config()
app.use(express.json())
app.use(express.static('public'))
const { spawn,exec } = require('child_process')
const PORT = process.env.PORT
const str = "\\"
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
    console.log('received a post request')
    //const conda = spawn('conda run',['-n test','python ./Satlib/walker_script.py'])
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
    const preprocessedParams = parseBody(req.body.walkerParams)
    const command = `python ./SatLib/walker_script.py ${preprocessedParams}`
    console.log(command);
    /*
    fs.readFile('./public//czml.txt','utf-8',(err,data) => {
          if(err){
            console.log('err')
            return
          }
          res.json({
            stdout:data,
            error:'',
            stderr:''
          })
      })
    */
    exec(command,(error,stdout,stderr)=>{
      console.log(`Error:${error}`)
      console.log(`Stdout:${stdout}`)
      console.log(`Stderr:${stderr}`)
      /*
      fs.writeFile('./czml.txt',stdout, err => {
          if(err){
            console.log('err')
            return
          }
      })
      */
      res.json({
        stdout:stdout,
        error:error,
        stderr:stderr
      })
    })
    /*
    const python = spawn('python',['./SatLib/walker_script.py'])
    python.stdout.on('data', function(data) {
      console.log(data.toString()); 
    });

    python.stderr.on('data', function(data) {
        console.error(data.toString());
    });
    
    conda.stdout.on('data', function(data) {
      console.log(data.toString()); 
    });

    conda.stderr.on('data', function(data) {
        console.error(data.toString());
    });
    
    let msg = ''
    console.log(req.body)
    const python = spawn('python',['script.py', JSON.stringify(req.body)])
    python.stdout.on('data',(data) => {
        msg = data.toString()
    })
    python.on('close',()=>{
        res.json({msg:msg,czml:dummyCzml})
    })
    */
})

app.listen(PORT, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Listening on port ${PORT}`)
    }
})