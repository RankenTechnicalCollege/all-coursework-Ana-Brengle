const validate = (schema) => (req, res, next) => {

    const options = {
        abortEarly: false,
        allowUnknown: false,
        stripDown: true
    }
    
    const {error, value} = schema.validate(req.body, options);

    if(error) {
        const errorMes = error.details.map(detail => detail.message);
        return res.status(400).json({
            status: "Error",
            type: 'Validation Fail',
            message: 'Invalid Data submitted. See details for errors',
            detail: errorMes
        });
    }

    req.body = value;

    next();

}
export {validate};