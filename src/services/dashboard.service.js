const prisma = require("../config/prisma");

/**
 * Get a comprehensive dashboard summary for a user.
 * Includes: totalIncome, totalExpenses, netBalance,
 * categoryTotals, recentTransactions, monthlySummary.
 */
const getSummary = async (userId, filters = {}) => {
  const { startDate, endDate } = filters;
  const where = { userId, deletedAt: null };
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  // Fetch all records for the user in one query based on filters
  const allRecords = await prisma.financialRecord.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const totalIncome = computeTotal(allRecords, "INCOME");
  const totalExpenses = computeTotal(allRecords, "EXPENSE");
  const netBalance = totalIncome - totalExpenses;

  const categoryTotals = computeCategoryTotals(allRecords);
  const recentTransactions = allRecords.slice(0, 5);
  const monthlySummary = computeMonthlySummary(allRecords);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    recentTransactions,
    monthlySummary,
  };
};

/**
 * Compute total amount for a given type (INCOME or EXPENSE).
 */
const computeTotal = (records, type) => {
  return records
    .filter((r) => r.type === type)
    .reduce((sum, r) => sum + r.amount, 0);
};

/**
 * Compute category-wise totals, grouped by type.
 * Returns: { income: { Salary: 5000, ... }, expense: { Rent: 1200, ... } }
 */
const computeCategoryTotals = (records) => {
  const result = { income: {}, expense: {} };

  for (const record of records) {
    const bucket = record.type === "INCOME" ? "income" : "expense";
    if (!result[bucket][record.category]) {
      result[bucket][record.category] = 0;
    }
    result[bucket][record.category] += record.amount;
  }

  return result;
};

/**
 * Compute monthly summaries.
 * Returns an array sorted by most recent month first:
 * [{ month: "2026-04", income: 5000, expense: 3000, net: 2000 }, ...]
 */
const computeMonthlySummary = (records) => {
  const monthMap = {};

  for (const record of records) {
    const d = new Date(record.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!monthMap[key]) {
      monthMap[key] = { month: key, income: 0, expense: 0 };
    }

    if (record.type === "INCOME") {
      monthMap[key].income += record.amount;
    } else {
      monthMap[key].expense += record.amount;
    }
  }

  return Object.values(monthMap)
    .map((m) => ({ ...m, net: m.income - m.expense }))
    .sort((a, b) => b.month.localeCompare(a.month));
};

/**
 * Global search across records and users (if admin).
 */
const globalSearch = async (userId, query, role) => {
  if (!query || query.length < 2) return { records: [], users: [] };

  const records = await prisma.financialRecord.findMany({
    where: {
      userId,
      deletedAt: null,
      OR: [
        { notes: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { date: "desc" },
  });

  let users = [];
  if (role === "ADMIN") {
    users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    });
  }

  return { records, users };
};

module.exports = {
  getSummary,
  globalSearch,
};
