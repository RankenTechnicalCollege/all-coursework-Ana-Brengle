import Joi from "joi";

const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    fullName: Joi.string().min(1).optional()
}).required();

export {updateUserSchema}