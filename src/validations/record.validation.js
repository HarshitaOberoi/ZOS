const { z } = require("zod");

const dateInput = z.string().refine((value) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}, "Invalid date format");

const createRecord = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: dateInput,
    notes: z.string().optional(),
  }),
});

const updateRecord = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be a positive number").optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1, "Category is required").optional(),
    date: dateInput.optional(),
    notes: z.string().optional(),
  }),
});

const deleteRecord = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
});

const getRecords = z.object({
  query: z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: dateInput.optional(),
    endDate: dateInput.optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
  }),
});

const getSummary = z.object({
  query: z.object({
    startDate: dateInput.optional(),
    endDate: dateInput.optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(), // The existing method parses it
  }),
});

module.exports = {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecords,
  getSummary,
};
