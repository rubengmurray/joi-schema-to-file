import Joi from 'joi'

export const myObjSchema = Joi.object().keys({
    id: Joi.number().integer(),
    enabled: Joi.boolean()
})
