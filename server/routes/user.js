const express  = require('express')
const router = express.Router()

const { Signup_Schema } = require('../validations/validation')
const {signup_User, login_User, getAll_User, single_User, delete_User, Edit_user} = require('../controller/user')
const checkAuth = require('../middleware/auth')

router.post('/signup',Signup_Schema, signup_User)
router.post('/login', login_User)
router.get('/allusers/:UserId', checkAuth, getAll_User)
router.get('/:UserId', checkAuth, single_User)
router.get('/delete/:UserId', checkAuth, delete_User)
router.post('/Edit/:UserId', checkAuth, Edit_user)

module.exports = router