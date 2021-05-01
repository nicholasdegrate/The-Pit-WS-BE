const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io"); 

const PORT = 3030;

const app = express();
const server = http.createServer(app);

const io = socket(server, {
  cors: true,
  origins:["localhost:3001"]
});

app.use(cors());

io.on("connection", (socket) => {
    console.log('new connected stocked 1')

    // socket.emit('message', 'welcome to chatroom')

    // socket.broadcast.emit('message', 'a user has joined the chat')

    // socket.on('disconnect', () => {
    //     io.emit()
    // })

    // listen for chatmessage
    socket.on('chatMessage', (msg) => {
        console.log(msg)
        io.emit('message', msg)
    })
});

server.listen(PORT, () => console.log(`listening on *:${PORT}`));