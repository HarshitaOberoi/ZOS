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

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
