const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const updatedUser = await userService.updateUser({ id, role, status });

  res.json({ message: "User updated successfully", user: updatedUser });
});

module.exports = {
  getUsers,
  updateUser,
};
