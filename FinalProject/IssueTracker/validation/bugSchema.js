import Joi from "joi";

const addBugSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  stepsToReproduce: Joi.string().required()
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

const addCommentSchema = Joi.object({
  authorId: Joi.string().required(),
  text: Joi.string().required()
}).required();

const addTestCaseSchema = Joi.object({
  title: Joi.string().required(),
  status: Joi.string().valid("passed", "failed").required()
}).required()

const updateTestCaseSchema = Joi.object({
  title: Joi.string().optional(),
  status: Joi.string().valid("passed", "failed").optional(),
  testAuthor_id: Joi.string().optional()
}).required()

export {closeBugSchema, assignBugSchema, classifyBugSchema, updateBugSchema, addBugSchema, addCommentSchema, addTestCaseSchema, updateTestCaseSchema}