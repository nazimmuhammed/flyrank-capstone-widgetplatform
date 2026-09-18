const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const widgetRoutes = require("./routes/widgets");
const submissionRoutes = require("./routes/submissions");
const publicRoutes = require("./routes/public");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(require("path").join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "FlyRank Widget Platform API is running"
  });
});

app.use("/auth", authRoutes);

app.use("/widgets", publicRoutes);
app.use("/widgets", widgetRoutes);

app.use("/submissions", submissionRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/widget.js", (req, res) => {
  res.sendFile("widget.js", {
    root: require("path").join(__dirname, "../public")
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});