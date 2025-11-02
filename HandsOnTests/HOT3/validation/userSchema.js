import Joi from "joi";

const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fullName: Joi.string().min(1).required()
}).required();

export {updateUserSchema}