const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

/**
 * Create a new financial record for a user.
 */
const createRecord = async (userId, data) => {
  const { amount, type, category, date, notes } = data;

  if (!amount || !type || !category || !date) {
    throw new ApiError(400, "Missing required fields: amount, type, category, date.");
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date format. Use ISO 8601 (e.g. 2026-04-02).");
  }

  if (!["INCOME", "EXPENSE"].includes(type)) {
    throw new ApiError(400, "Type must be either INCOME or EXPENSE.");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new ApiError(400, "Amount must be a positive number.");
  }

  const record = await prisma.financialRecord.create({
    data: {
      userId,
      amount,
      type,
      category,
      date: parsedDate,
      notes: notes || null,
    },
  });

  return record;
};

/**
 * Get all records for a user with optional filters.
 * Filters: type, category, startDate, endDate, search
 */
const getRecords = async (userId, filters = {}) => {
  const { type, category, startDate, endDate, page = 1, limit = 20, search } = filters;

  const where = { userId, deletedAt: null };

  if (search) {
    where.notes = { contains: search };
  }

  if (type) {
    if (!["INCOME", "EXPENSE"].includes(type)) {
      throw new ApiError(400, "Type filter must be INCOME or EXPENSE.");
    }
    where.type = type;
  }

  if (category) {
    where.category = category;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take,
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    records,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};

/**
 * Get a single record by ID, scoped to the user.
 */
const getRecordById = async (userId, recordId) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id: recordId, userId, deletedAt: null },
  });

  if (!record) {
    throw new ApiError(404, "Record not found.");
  }

  return record;
};

/**
 * Update a financial record.
 */
const updateRecord = async (userId, recordId, data) => {
  const existing = await prisma.financialRecord.findFirst({
    where: { id: recordId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new ApiError(404, "Record not found.");
  }

  const { amount, type, category, date, notes } = data;

  if (type && !["INCOME", "EXPENSE"].includes(type)) {
    throw new ApiError(400, "Type must be either INCOME or EXPENSE.");
  }

  if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
    throw new ApiError(400, "Amount must be a positive number.");
  }

  const updateData = {};
  if (amount !== undefined) updateData.amount = amount;
  if (type) updateData.type = type;
  if (category) updateData.category = category;
  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format. Use ISO 8601 (e.g. 2026-04-02).");
    }
    updateData.date = parsedDate;
  }
  if (notes !== undefined) updateData.notes = notes;

  const record = await prisma.financialRecord.update({
    where: { id: recordId },
    data: updateData,
  });

  return record;
};

/**
 * Delete a financial record.
 */
const deleteRecord = async (userId, recordId) => {
  const existing = await prisma.financialRecord.findFirst({
    where: { id: recordId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new ApiError(404, "Record not found.");
  }

  await prisma.financialRecord.update({
    where: { id: recordId },
    data: { deletedAt: new Date() },
  });

  return { message: "Record deleted successfully." };
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
