const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Optionally assign back to req (useful if Zod transformed values)
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Format the error message
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return next(new ApiError(400, errorMessage));
    }
    next(error);
  }
};

module.exports = { validate };
