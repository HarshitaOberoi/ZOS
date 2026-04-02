const { z } = require("zod");
const { ROLES } = require("../middlewares/auth.middleware");

const updateUser = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
});

module.exports = {
  updateUser,
};
