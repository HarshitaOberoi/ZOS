export const ROLES = {
  VIEWER: "VIEWER",
  ANALYST: "ANALYST",
  ADMIN: "ADMIN",
};

export const STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const RECORD_TYPES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
};

export const CATEGORY_OPTIONS = [
  "Salary",
  "Investments",
  "Consulting",
  "Rent",
  "Travel",
  "Marketing",
  "Payroll",
  "Subscriptions",
  "Operations",
  "Utilities",
  "Healthcare",
  "Entertainment",
];

export const ROLE_COPY = {
  VIEWER: "Read-only access to financial data.",
  ANALYST: "Can create and manage records.",
  ADMIN: "Full operational and user administration control.",
};

export const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Records", href: "/records" },
  { label: "Admin", href: "/admin", roles: [ROLES.ADMIN] },
];
