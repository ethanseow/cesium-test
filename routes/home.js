const express = require('express');
const routers = express.Router()
const homeRouterDebug = require('debug')('homeRouter')

routers.get(['/','/home'], (req,res,next) => {
    res.sendFile(process.env.HOME + '/index.html');
});

module.exports = routers
