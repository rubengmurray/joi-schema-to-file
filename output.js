Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})