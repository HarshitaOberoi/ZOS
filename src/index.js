const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const recordRoutes = require("./routes/record.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");

const app = express();
const distPath = path.resolve(__dirname, "../dist");
const hasFrontendBuild = fs.existsSync(distPath);

app.use(express.json());

app.use("/api", apiLimiter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Zorvyn API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

if (hasFrontendBuild) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      message: "Zorvyn API is running. Build the frontend with `npm run build` to serve the dashboard.",
    });
  });
}

app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
}

module.exports = app;
