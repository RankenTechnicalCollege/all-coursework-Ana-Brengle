import Joi from 'joi';
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('developer', 'business analyst', 'quality analyst', 'product manager', 'technical manager').required(),
    password: Joi.string().min(6).required(),
    createdAt: Joi.date().default(() => new Date())
}).required();

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(8).required()
}).required();

const updateUserSchema = Joi.object({
    role: Joi.string().valid('developer', 'business Analyst', 'quality analyst', 'product manager', 'technical manager').optional(),
    fullName: Joi.string().optional(),
    password: Joi.string().max(8).optional(),
    email: Joi.string().email().optional()
}).required();



export {registerSchema,loginSchema, updateUserSchema};