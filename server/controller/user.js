const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises;
const util = require('util')

const User = require('../models/user')

exports.signup_User = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (user) {
                return res.status(409).json({ message: "Mail exists" })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: err })
                    } else {
                        const image = req.body.profile

                        const base64Image = image.Images
                        const base64ext = image.ext

                        const binaryData = Buffer.from(base64Image, "base64")
                        const fileName = `images${Date.now()}${base64ext}`
                        const filepath = `./uploads/${fileName}`
                        fs.writeFileSync(filepath, binaryData)

                        const user = new User({
                            // _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            profile: fileName
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created"
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err })
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.login_User = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            // console.log(user);
            if (user) {
                // console.log(user);
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    console.log(err);
                    if (err) {
                        console.log(err);
                        return res.status(401).json({ message: "Password was wrong" })
                    }
                    if (result) {
                        console.log(result);
                        const token = jwt.sign({
                            email: user.email,
                            ID: user._id
                        }, "parth", {
                            expiresIn: "1h"
                        })

                        return res.status(200).json({
                            ID: user._id,
                            Email: user.email,
                            token: token,
                            message: "Auth Successful"
                        })
                    }
                })
            } else {
                return res.status(401).json({
                    message: "User not Found"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.getAll_User = (req, res, next) => {
    console.log(req.params.UserId);
    User.find({ _id: { $nin: req.params.UserId } }).select('firstName lastName _id profile').exec()
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.single_User = (req, res, next) => {
    User.findById(req.params.UserId).select("firstName lastName _id profile email").exec()
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.delete_User = (req, res, next) => {
    User.deleteOne({ _id: req.params.UserId }).exec()
        .then(response => {
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.Edit_user = async (req, res, next) => {
    try {
        const UserData = await User.find({ _id: { $nin: req.params.UserId } }).exec()
        // console.log(UserData);

        UserData.map(async Items => {
            if(Items.email != req.body.email){
                if (req?.body?.password) {
                    // console.log('hiiiiiiii');
                    const hashPassword = util.promisify(bcrypt.hash)
                    const hash = await hashPassword(req.body.password, 10)
                    req.body.password = hash
                }

                if (req?.body?.profile?.Images) {

                    const base64Image = req.body.profile.Images
                    const base64ext = req.body.profile.ext

                    const binaryData = Buffer.from(base64Image, "base64")
                    const fileName = `images${Date.now()}${base64ext}`
                    const filepath = `./uploads/${fileName}`

                    await fs.writeFile(filepath, binaryData);
                    await fs.unlink(`./uploads/${req.body.oldProfile}`);

                    req.body.profile = fileName
                }
                const updatedUser = await User.findByIdAndUpdate(req.params.UserId, req.body)
                if (!updatedUser) {
                    return res.status(404).json({ error: "User not Found" })
                }
                return res.status(200).json({ updatedUser })
            } else {
                return res.status(404).json({ error: "Mail exists"}) 
            }
        })

        // for (const Items of UserData) {
        //     console.log('ALlll',Items);
        //     if (Items.email != req.body.email) {
        //         if (req?.body?.password) {
        //             // console.log('hiiiiiiii');
        //             const hashPassword = util.promisify(bcrypt.hash)
        //             const hash = await hashPassword(req.body.password, 10)
        //             req.body.password = hash
        //         }

        //         if (req?.body?.profile?.Images) {

        //             const base64Image = req.body.profile.Images
        //             const base64ext = req.body.profile.ext

        //             const binaryData = Buffer.from(base64Image, "base64")
        //             const fileName = `images${Date.now()}${base64ext}`
        //             const filepath = `./uploads/${fileName}`

        //             await fs.writeFile(filepath, binaryData);
        //             await fs.unlink(`./uploads/${req.body.oldProfile}`);

        //             req.body.profile = fileName
        //         }
        //         const updatedUser = await User.findByIdAndUpdate(req.params.UserId, req.body)
        //         if (!updatedUser) {
        //             return res.status(404).json({ error: "User not Found" })
        //         }
        //         return res.status(200).json({ updatedUser })
        //     } else {
        //         console.log('hiiiiiiiii');
        //         return res.status(404).json("Mail exists")
        //     }
        // }

    } catch (err) {
        return res.status(500).json({ error: err })
    }
}
