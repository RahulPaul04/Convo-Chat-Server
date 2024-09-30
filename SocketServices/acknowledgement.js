const connectedUsers = require('./connection')
const Message = require('../models/messagemodel')


const updateDatabase = async (msgids) => {

    await Message.updateMany({_id:msgids},{delivered:true})

}

const ack = (msgids,senderid) => {

    console.log("Received Message ack for message Id: ",msgids,senderid);
    if(senderid in connectedUsers){
        sendersocket = connectedUsers[senderid]
        sendersocket.emit('recipientack',msgids)
    }

    updateDatabase(msgids)

}   

module.exports = ack