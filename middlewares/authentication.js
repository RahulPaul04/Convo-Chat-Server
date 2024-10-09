const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecretKey = process.env.jwtSecretkey;


const authenticateToken = (req,res,next) => {
    const token = req.header('Authorization')?.split(' ')[1]
    if(!token){
        return res.status(401).json({msg:"Access Denied"})
    }

    try {
        console.log(token,"authenticate here",jwtSecretKey);
        const verified = jwt.verify(token,"jwt secret key")
        req.userId = verified
        next()
    }
    catch (err) {
        return res.status(400).json({msg:"Invalid Token"})
    }
}

module.exports = authenticateToken