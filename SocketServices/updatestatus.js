const User = require('../models/usermodel')
const connectedUsers = require('../SocketServices/connection')

const updateStatus = async (id,online) => {

    let update

    if(online){
        update = {id:id,online:true}
    }
    else{
        let lastseen = new Date()
        await User.findByIdAndUpdate(id,{lastseen:lastseen})
        update = {id:id,online:false,lastseen:lastseen}
    }

    const chatids = await User.findById(id).select('chatsWith')
    let chatnames = chatids.chatsWith
    console.log("sending status update",chatnames);
    chatnames.map((chatid)=>{
        if(chatid.toString() in connectedUsers){
            let socket = connectedUsers[chatid]
            console.log("-------------------------");
            console.log("inside sending update");
            console.log("------------------------------");
            console.log("update send",update);
            
            socket.emit('statusupdate',update)
        }
    })
}

module.exports = updateStatus