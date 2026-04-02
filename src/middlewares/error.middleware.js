const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  // If the error has a specific status code set, use it
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Duplicate field value entered." });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Record not found." });
    }
    return res.status(400).json({ error: "Database error occurred." });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  // Default error
  return res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { errorHandler };
