const Message = require('../models/messagemodel')
const connectedUsers = require('../SocketServices/connection')

const updateDatabase = async (msgid) => {
    await Message.updateOne({_id:msgid},{content:"This Message has been deleted",deleted:true})
}

const deleteMsg = (msg) => {
    msgid = msg._id


    nmsg = {...msg}
    nmsg.content = "This Message has been deleted"
    nmsg.deleted = true

    if (msg.recipient in  connectedUsers){
        receipientSocket = connectedUsers[msg.recipient]
        console.log("Sending delete to recipent");
        receipientSocket.emit('delete',msgid)
    }

    updateDatabase(msgid)

}

module.exports = deleteMsg