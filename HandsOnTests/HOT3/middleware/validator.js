import { ObjectId } from "mongodb";

const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  }

  const {error, value} = schema.validate(req.body, options);
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message);

    return res.status(400).json({
      status: 'error',
      type: 'validationFailed',
      message: 'Invalid data submitted. See details for errors.',
      details: errorMessage
    })
  }
  else {

  }

  req.body = value;

  next();
}

const validId = (paramName) => {
  return (req,res,next) => {
    try {
      req[paramName] = new ObjectId(req.params[paramName]);
      return next();
    }
    catch (error) {
      console.error( error);
      return res.status(400).json({message: `${paramName} is not a valid id`});
    }
  }
}
export {validate, validId};