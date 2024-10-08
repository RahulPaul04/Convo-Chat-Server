const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/usermodel')
const Message = require('../models/messagemodel')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middlewares/authentication')
const multerMiddleware = require('../middlewares/multermiddleware')
require('dotenv').config()

jwtSecretKey = process.env.jwtSecretkey;


router.post('/register',multerMiddleware.single('profilephoto'),async (req,res)=>{
    const {name,email,password} = req.body
    const profilephoto = req.file? req.file.filename : null

    console.log(profilephoto);

    console.log("request received",name,email,password);

    let user = await User.findOne({email})

    if(user) {
        console.log("checking for Duplicates");
        return res.status(400).json({msg:"Email Id Already Registered"})
    }

    user = new User({
        name,
        email,
        password,
        profilephoto
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password,salt)

    try{
        await user.save()
        console.log("user registered successfully");

        return res.status(201).json({msg:"User Registered Successfully"})
    }
    catch(err){
        console.log(err);
        console.log("error during registration");
        return res.status(500).json({msg:"Internal Server Error"})
    }
})

router.post('/login', async (req,res)=>{
    const {email,password} = req.body
    try{
        console.log("Checking User");
        currentuser = await User.findOne({email})

        if(currentuser){
            try{
            console.log("Validating User");
            pass = currentuser.password
            const validcred = await bcrypt.compare(password,pass)
            if(validcred){
                console.log("User Validated");
                const token = jwt.sign({userId:currentuser._id},jwtSecretKey)
                //todo Don't send the password
                return res.status(200).json({currentuser,token})
            }
            else{
                return res.status(401).json({msg:"Incorrect Username or Password"})
            }
            }
            catch(err){
                return res.status(500).json({msg:"Server Error"})
            }
        }
        else{
            return res.status(404).json({msg:"User Does Not Exist"})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"})
    }
})

router.get('/chat/:id',authenticateToken,async(req,res)=>{
    const userId = req.params.id
    console.log(userId);
    try {
        const user = await User.findById(userId)
        if (!user){
            return res.status(404).json({msg:"User not found"})
            
        }
        const chatuserIds = user.chatsWith
        const chatUsers = await User.find(
            {'_id':{$in: chatuserIds}},
            { 'name': 1, 'profilephoto': 1 }
        ) 

        const messagearray = await Message.find({
            $or:[
                {sender:userId},
                {recipient:userId}
            ]
        })

        const userdata = {
            user:user,
            chatusers:chatUsers,
            messagearray:messagearray
        }

        
        res.json(userdata)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({msg:"Internal Server Error"})
    }



})

router.get('/search/:email', async (req,res) =>{
    
    const email = req.params.email
    console.log(email);
    try {
        const user = await User.findOne({email:email})
        console.log("searched user",user);
        if(user){
            const userdata = {
                _id:user._id,
                name:user.name
            }
            
            return res.status(200).json({user:userdata})
        }
        else{
            return res.status(404).json({msg:"User not Found"})
        }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"})
    }   

})

module.exports = router