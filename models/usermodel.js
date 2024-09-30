const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastseen:{
        type:Date,
        default:Date.now
    },
    chatsWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    profilephoto:{
        type:String
    }
})


const User = mongoose.model('User',userSchema)

module.exports = User