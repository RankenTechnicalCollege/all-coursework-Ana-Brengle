import Joi from "joi";

const addBugSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  stepsToReproduce: Joi.string().min(1).required()
}).required();

const updateBugSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  stepsToReproduce: Joi.string().optional()
}).required();

const classifyBugSchema = Joi.object({
  classification: Joi.string().required()
}).required();

const assignBugSchema = Joi.object({
  assignedToUserId: Joi.string().required()
}).required();

const closeBugSchema = Joi.object({
  closed: Joi.boolean().required()
}).required();

export {closeBugSchema, assignBugSchema, classifyBugSchema, updateBugSchema, addBugSchema}