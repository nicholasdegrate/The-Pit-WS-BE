const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const PORT = 3030;
const app = express();
const server = http.createServer(app);

const io = socket(server, {
    cors: true,
    origins: ["localhost:3001"]
});

app.use(cors());

const users = {}

io.on('connection', socket => {
   
    // socket.on('new-user', name => {
    //     users[socket.id] = name
    //     socket.broadcast.emit('user-connected', name)
    // })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
    // socket.on('disconnect', () => {
    //     socket.broadcast.emit('user-disconnected', users[socket.id])
    //     delete users[socket.id]
    // })
})

server.listen(PORT, () => console.log(`listening on *:${PORT}`));