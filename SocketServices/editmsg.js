const Message = require('../models/messagemodel')
const connectedUsers = require('../SocketServices/connection')


const updateDatabase = async (newmsg,msgid) => {
    await Message.updateOne({_id:msgid},{content:newmsg,edited:true})
}

const Editmsg = (newmsg,msg) =>{
    msgid = msg._id

    nmsg = {...msg}
    nmsg.content = newmsg
    nmsg.edited = true
    console.log("edited message with id",msgid);
    if (msg.recipient in  connectedUsers){
        receipientSocket = connectedUsers[msg.recipient]
        console.log("Sending editmessage to recipent");
        receipientSocket.emit('edit',newmsg,msgid)
    }


    updateDatabase(newmsg,msgid)



}


module.exports = Editmsg