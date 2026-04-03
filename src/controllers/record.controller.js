const recordService = require("../services/record.service");
const catchAsync = require("../utils/catchAsync");

const createRecord = catchAsync(async (req, res) => {
  const record = await recordService.createRecord(req.user.id, req.body);
  res.status(201).json({ message: "Record created successfully", record });
});

const getRecords = catchAsync(async (req, res) => {
  const result = await recordService.getRecords(req.user.id, req.query);
  res.json(result);
});

const getRecordById = catchAsync(async (req, res) => {
  const record = await recordService.getRecordById(req.user.id, req.params.id);
  res.json(record);
});

const updateRecord = catchAsync(async (req, res) => {
  const record = await recordService.updateRecord(req.user.id, req.params.id, req.body);
  res.json({ message: "Record updated successfully", record });
});

const deleteRecord = catchAsync(async (req, res) => {
  const result = await recordService.deleteRecord(req.user.id, req.params.id);
  res.json(result);
});

const exportCSV = catchAsync(async (req, res) => {
  const { type, category, startDate, endDate, search } = req.query;
  const { records } = await recordService.list({
    userId: req.user.id,
    type,
    category,
    startDate,
    endDate,
    search,
    limit: 10000, // Large limit for export
  });

  const csvHeaders = "Date,Type,Category,Amount,Notes\n";
  const csvRows = records
    .map((r) => {
      const date = new Date(r.date).toLocaleDateString();
      const notes = r.notes ? `"${r.notes.replace(/"/g, '""')}"` : "";
      return `${date},${r.type},${r.category},${r.amount},${notes}`;
    })
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=zorvyn-records-${new Date().toISOString().split("T")[0]}.csv`);
  res.status(200).send(csvHeaders + csvRows);
});

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportCSV,
};
