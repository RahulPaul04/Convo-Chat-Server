require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

const connectdb = require('./db/connection')
const router = require('./routes/routes')
const authenticatesocket = require('./middlewares/socketauthentication')
const message = require('./SocketServices/message')
const ack = require('./SocketServices/acknowledgement')
const seenAck = require('./SocketServices/seenkack')
const addUser = require('./SocketServices/adduser')
const userStatus = require('./SocketServices/userstatus')
const updateStatus = require('./SocketServices/updatestatus')
const Editmsg = require('./SocketServices/editmsg')
const deleteMsg = require('./SocketServices/deletemsg')

const connectedUsers = require('./SocketServices/connection')

const mongodbUrl = process.env.mongodb_url;

// connectdb('mongodb://localhost:27017/Chat')
connectdb(mongodbUrl)


const app = express()

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
      }
})

app.use(cors())
app.use(express.json())
app.use(router)
app.use('/profileimgs',express.static('./profileimgs'))

const PORT = process.env.PORT || 3000


io.use(authenticatesocket)

io.on('connection', (socket) => {
    console.log(socket.conn.transport.name);
    console.log("User Connected Websocket");

    connectedUsers[socket.userId] = socket
    updateStatus(socket.userId,true)

    socket.on('message',(msg) => message(io,socket,msg))
    socket.on('recipientack',(msgids,senderid) => ack(msgids,senderid))
    socket.on('seenack',(msgids,senderid) => seenAck(msgids,senderid))   
    socket.on('newchatuser',(userid,chatuserid)=> addUser(socket,userid,chatuserid)) 
    socket.on('getuserstatus',(id) => userStatus(socket,id))
    socket.on('editmsg',(newmsg,msg) => Editmsg(newmsg,msg))
    socket.on("deletemsg",(msg) => deleteMsg(msg))

    socket.on('disconnect',(reason) => {
        console.log("socket disconnected due to ",reason);
        updateStatus(socket.userId,false)
        delete connectedUsers[socket.userId]
        const activeSockets = [];
        io.sockets.sockets.forEach((socket) => {
        activeSockets.push({
            id: socket.id,
            userId: socket.userId, // Assuming you store userId on socket
            // Add any other properties you want to track
        });
    });
    console.log("active sockets", activeSockets);
    })
})

server.listen(PORT,()=>{
    console.log(`Server Started at port ${PORT}`);
})

app.get('/',(req,res)=>{
    res.status(200).send(`<h1>server Running successful</h1>`)
})