const Joi = require('joi')
const { AppError } = require('./Utilities')

const sectionSchema = Joi.object({
    section: Joi.object({
        label: Joi.string().required()
    }).required()

})

const taskSchema = Joi.object({
    task: Joi.object({
        task: Joi.string().required(),
        due: Joi.string().required(),
        description: Joi.string(),
        priority: Joi.string()
    }).required()
})

const validateSection = (req, res, next) => {
    const { error } = sectionSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    return next()
}

const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    return next()
}

module.exports.validateTask = validateTask
module.exports.validateSection = validateSection