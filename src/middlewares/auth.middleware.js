const jwt = require("jsonwebtoken");
const config = require("../config");
const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      return next(new ApiError(401, "Invalid token."));
    }
    
    if (user.status !== "ACTIVE") {
      return next(new ApiError(403, "Account is inactive."));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Invalid or expired token."));
    }
    next(err);
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden. You do not have the required role."));
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  ROLES: {
    ADMIN: "ADMIN",
    ANALYST: "ANALYST",
    VIEWER: "VIEWER"
  }
};
