const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const sqlitePath = dbUrl.replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: sqlitePath });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
