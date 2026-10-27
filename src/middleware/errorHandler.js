module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors;

  // Mongoose validation (missing required field, bad value) -> 400
  if (err.name === 'ValidationError') {
    status = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed';
  }

  // Duplicate unique value (e.g. same email / category name) -> 400
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  // Invalid ObjectId format -> 404
  if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
  }

  // Malformed JSON body -> 400
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500) console.error(err);

  const body = { success: false, message };
  if (errors) body.errors = errors;
  res.status(status).json(body);
};
