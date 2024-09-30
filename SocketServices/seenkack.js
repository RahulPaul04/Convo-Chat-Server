const connectedUsers = require('./connection')
const Message = require('../models/messagemodel')

const updateDatabase = async (msgids) => {

    await Message.updateMany({_id:msgids},{seen:true})

}

const seenAck = (msgids,senderid) => {

    console.log("Received seen ack for message Id: ",msgids,senderid);
    if(senderid in connectedUsers){
        sendersocket = connectedUsers[senderid]
        sendersocket.emit('seenack',msgids)
    }

    updateDatabase(msgids)

}

module.exports = seenAck