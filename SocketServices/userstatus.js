const connectedUsers = require('./connection')
const User = require('../models/usermodel')

const userStatus = async (socket,id) => {

    if(id in connectedUsers){
        console.log("id in connected user",id);
        socket.emit('statusupdate',{id:id,online:true})
    }
    else{
        console.log("user not online now",id);
        try {
            let response = await User.findById(id).select('lastseen')
            console.log(response.lastseen,"status response");
            if(response){
                console.log("sending status update for last seen");
                socket.emit('statusupdate',{id:id,lastseen:response.lastseen})
            }
            else{
                console.log("sednign null update");
                socket.emit('statusupdate',{id:id,lastseen:null})
            }
        }
        catch(err){
            console.log(err);
            socket.emit('statusupdate',{id:id,lastseen:null})
        }
    }
}

module.exports = userStatus