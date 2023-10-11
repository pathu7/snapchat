const Joi = require('joi')

const Signup_Schema = (req, res, next) => {
    const Schema = Joi.object().keys({
        profile: {Images: Joi.string().required(), ext: Joi.string().required()},
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({tlds: { allow: false }}).required(),
        password: Joi.string().required(),
    }).unknown(false)

    const { error } = Schema.validate(req.body, {abortEarly: false})
    if(error){
        const { details } = error
        res.status(400).json({ error: details })
    } else {
        next()
    }

}

module.exports = { Signup_Schema }