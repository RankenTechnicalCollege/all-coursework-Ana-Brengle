import Joi from 'joi';
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('Developer', 'Business Analyst', 'Quality Analyst', 'Product Manager', 'Technical Manager').required(),
    givenName: Joi.string().required(),
    familyName: Joi.string().required(),
    password: Joi.string().max(8).required(),
    createdAt: Joi.date().required()
}).required();

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(8).required()
}).required();

const updateUserSchema = Joi.object({
    role: Joi.string().valid('Developer', 'Business Analyst', 'Quality Analyst', 'Product Manager', 'Technical Manager').optional(),
    givenName: Joi.string().optional(),
    familyName: Joi.string().optional(),
    fullName: Joi.string().optional(),
    password: Joi.string().max(8).optional(),
    email: Joi.string().email().optional()
}).required();



export {registerSchema,loginSchema, updateUserSchema};