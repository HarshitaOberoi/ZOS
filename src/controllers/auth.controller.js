const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Existing validation should be handled by validation middleware,
  // but just in case, basic check is here or in validation layer.
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newUser = await authService.register({ name, email, password });

  res.status(201).json({ message: "User registered successfully", user: newUser });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password." });
  }

  const { token, user } = await authService.login({ email, password });

  res.json({
    message: "Login successful",
    token,
    user
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.json({ user });
});

module.exports = {
  register,
  login,
  getMe,
};
