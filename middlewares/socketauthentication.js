const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecretKey = process.env.jwtSecretKey


const authenticatesocket = (socket,next) =>{
    const {token,userId} = socket.handshake.query

    if(!token || !userId){
        return next(new Error('Authentication Error: missing token or userId'))
    }

    const verified = jwt.verify(token,jwtSecretKey)

    if(!verified){
        return next(new Error("Authentication Error: invalid token"))
    }

    socket.userId = verified.userId
    next()

}

module.exports = authenticatesocket