const ApiResponse = require("../utils/apiResponse")

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === "ValidationError") {
    return ApiResponse.error(res, "Validation Error", 400, err.errors)
  }

  if (err.name === "CastError") {
    return ApiResponse.error(res, "Invalid ID format", 400)
  }

  if (err.code === 11000) {
    return ApiResponse.error(res, "Duplicate key error", 400)
  }

  return ApiResponse.error(res, "Internal Server Error", 500)
}

module.exports = errorHandler

