const {
  ValidationError,
  UnauthorizedError,
  WrongParamsError,
  ConflictError,
} = require('./errors')

const asyncWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error)
    }
  }
}

const errorHandler = (error, req, res, next) => {
  if(
    error instanceof ValidationError || 
    error instanceof UnauthorizedError || 
    error instanceof WrongParamsError || 
    error instanceof ConflictError
    ) 
    {
      return res.status(error.status).json({message: error.message})
    }
    res.status(500).json({message: error.message})
}

module.exports = {
  asyncWrapper,
  errorHandler,
}