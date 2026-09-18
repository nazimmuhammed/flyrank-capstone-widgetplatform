const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const widgetRoutes = require("./routes/widgets");
const submissionRoutes = require("./routes/submissions");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/widgets", widgetRoutes);



app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "FlyRank Widget Platform API is running"
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});