import Joi from "joi";

const addProductSchema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
    price: Joi.number().min(0).required()
}).required()

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().min(1).optional(),
  category: Joi.string().min(1).optional(),
  price: Joi.number().min(0).optional()
}).required();

export {addProductSchema, updateProductSchema}