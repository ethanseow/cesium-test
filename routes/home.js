const express = require('express');
const routers = express.Router()
const path = require('path')

routers.get(['/','/home'], (req,res,next) => {
    res.sendFile(path.join(__dirname,'/../index.html'));
});

module.exports = routers
