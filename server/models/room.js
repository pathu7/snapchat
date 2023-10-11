const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    RoomId: { type: Array }
})

module.exports = mongoose.model("Room", RoomSchema)