const connectedUsers = require('./connection')
const Message = require('../models/messagemodel')


const databaseSave = async (message) => {
    
    try {
        await message.save()
        console.log("Message saved to database with id");
    }
    catch(err) {
        console.log("Error saving meesage to database",err)
    }
}

const message = (io,socket,msg,callback) =>{
    console.log("Message: ",msg);
    
    const newmessage = new Message(msg)
    msg.serverack = true

    if (msg.recipient in  connectedUsers && msg.recipient != msg.sender ){
        receipientSocket = connectedUsers[msg.recipient]
        console.log("Sending message to recipent");
        receipientSocket.emit('message',msg)
    }

    socket.emit('serverack',msg._id)

    databaseSave(newmessage)
    
}

module.exports = message