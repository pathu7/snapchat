const express = require('express')
const router = express.Router()

const { AddMessage, getMessage, CreateRoom, findRoomIdobj, findRoomIdarray,  } = require('../controller/message')
const checkAuth = require('../middleware/auth')

router.post("/room", checkAuth, CreateRoom )
router.get("/room/:senderId/:receiverId", checkAuth, findRoomIdobj )
router.get("/room/:senderId", checkAuth, findRoomIdarray )

router.post('/createmessage', checkAuth, AddMessage)
router.get('/message/:chatId', checkAuth, getMessage)



module.exports = router