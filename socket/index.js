const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://192.168.0.114:3000",
        methods: ["GET", "POST"],
    }
})

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on("room", (data) => {
        socket.join(data)
        console.log("user Room"+ data);
    })

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content)
    })

    socket.on("disconnect", () => {
        console.log("user disconnect");
    })
})

server.listen(8007, () => {
    console.log("server is On");
})