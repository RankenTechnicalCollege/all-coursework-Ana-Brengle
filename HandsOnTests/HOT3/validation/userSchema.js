import Joi from "joi";

const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fullName: Joi.string().min(1).required()
}).required();

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required();

const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fullName: Joi.string().min(1).required()
}).required();

export {registerUserSchema, loginUserSchema, updateUserSchema}