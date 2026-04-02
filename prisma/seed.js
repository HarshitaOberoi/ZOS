const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

const users = [
  {
    name: "Avery Quinn",
    email: "admin@zorvyn.io",
    password: "Admin@123",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    name: "Jordan Lee",
    email: "analyst@zorvyn.io",
    password: "Analyst@123",
    role: "ANALYST",
    status: "ACTIVE",
  },
  {
    name: "Morgan Park",
    email: "viewer@zorvyn.io",
    password: "Viewer@123",
    role: "VIEWER",
    status: "ACTIVE",
  },
];

const demoRecords = [
  { amount: 22000, type: "INCOME", category: "Salary", date: "2026-04-01", notes: "Primary recurring revenue" },
  { amount: 5800, type: "INCOME", category: "Consulting", date: "2026-03-16", notes: "Strategy sprint retainer" },
  { amount: 3600, type: "EXPENSE", category: "Payroll", date: "2026-03-12", notes: "Contractor payout" },
  { amount: 1800, type: "EXPENSE", category: "Marketing", date: "2026-02-27", notes: "Q1 campaign spend" },
  { amount: 950, type: "EXPENSE", category: "Subscriptions", date: "2026-02-11", notes: "Tooling and data platforms" },
  { amount: 3200, type: "INCOME", category: "Investments", date: "2026-01-22", notes: "Portfolio distribution" },
  { amount: 2400, type: "EXPENSE", category: "Travel", date: "2026-01-10", notes: "Client workshop travel" },
  { amount: 1200, type: "EXPENSE", category: "Operations", date: "2025-12-18", notes: "Office operations" },
];

async function seed() {
  for (const user of users) {
    const password = await bcrypt.hash(user.password, 10);

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
        role: user.role,
        status: user.status,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
        status: user.status,
      },
    });

    const existingRecords = await prisma.financialRecord.count({
      where: { userId: createdUser.id, deletedAt: null },
    });

    if (!existingRecords) {
      await prisma.financialRecord.createMany({
        data: demoRecords.map((record, index) => ({
          ...record,
          amount: record.amount + (createdUser.role === "ADMIN" ? index * 35 : createdUser.role === "ANALYST" ? index * 22 : index * 14),
          date: new Date(record.date),
          userId: createdUser.id,
        })),
      });
    }
  }

  console.log("Seed complete. Demo credentials:");
  console.log("ADMIN   admin@zorvyn.io   Admin@123");
  console.log("ANALYST analyst@zorvyn.io Analyst@123");
  console.log("VIEWER  viewer@zorvyn.io  Viewer@123");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
