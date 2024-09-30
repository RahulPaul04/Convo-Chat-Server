const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    content:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    senderName:{
        type:String,
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    recipientName:{
        type:String,
        reequired:true
    },
    serverack:{
        type:Boolean,
        default:true
    },
    delivered:{
        type:Boolean,
        default:false
    },
    seen:{
        type:Boolean,
        default:false
    }
},{
    timestamp:true
})

const Message = mongoose.model('Message',messageSchema)

module.exports = Message