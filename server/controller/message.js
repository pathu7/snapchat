const Message = require('../models/message')
const Room = require('../models/room')

exports.AddMessage = (req, res, next) => {
    console.log(req.body);
    const { senderId, receiverId, text, roomID } = req.body
    const newmessage = new Message({
        senderId, receiverId, text, roomID
    })
    console.log(newmessage);
    newmessage.save()
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.getMessage = async (req, res, next) => {
    const { chatId } = req.params
    console.log(req.params);
    try {
        const result = await Message.find({ roomID: { $all: [ chatId ]} })
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

exports.CreateRoom = (req, res, next) => {
    const newRoom = new Room({
        RoomId: [req.body.senderId, req.body.receiverId]
    })
    newRoom.save()
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}



exports.findRoomIdobj = (req, res, next) => {
    Room.findOne({
        RoomId: { $all: [req.params.senderId, req.params.receiverId] }
    })
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.findRoomIdarray = (req, res, next) => {
    Room.find({
        RoomId: { $in: [req.params.senderId]}
    })
    .then(response => {
        return res.status(200).json(response)
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
}

