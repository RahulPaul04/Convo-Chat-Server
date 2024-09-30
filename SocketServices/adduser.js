const User = require('../models/usermodel')

const addUser = async (socket,userid,chatuserid) => {

    console.log('new user added to',userid);

    await User.findOneAndUpdate({_id:userid},{ $push: { chatsWith: chatuserid } })
    const chatuser =  await User.findById(chatuserid)
    const update = {_id:chatuser._id,profilephoto:chatuser.profilephoto}
    socket.emit('profilephotoupdate',update)
}

module.exports = addUser