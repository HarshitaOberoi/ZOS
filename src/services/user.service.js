const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

const updateUser = async ({ id, role, status }) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const allowedRoles = ["VIEWER", "ANALYST", "ADMIN"];
  if (role && !allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role.");
  }

  const allowedStatuses = ["ACTIVE", "INACTIVE"];
  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status.");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(role && { role }),
      ...(status && { status }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    }
  });

  return updatedUser;
};

module.exports = {
  getUsers,
  updateUser,
};
