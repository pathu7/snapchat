const express  = require('express')
const router = express.Router()

const UserController = require('../controller/user')

router.post('/signup', UserController.signup_User)
router.post('/login', UserController.login_User)
router.get('/allusers/:UserId', UserController.getAll_User)
router.get('/:UserId', UserController.single_User)
router.get('/delete/:UserId', UserController.delete_User)
router.post('/Edit/:UserId', UserController.Edit_user)

module.exports = router