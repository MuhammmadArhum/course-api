// Wraps async controllers so thrown errors reach the error-handling middleware
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
