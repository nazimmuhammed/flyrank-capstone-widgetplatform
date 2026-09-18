const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  const token = jwt.sign(
    {
      tenantId: "demo-tenant",
      email
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    token
  });
});

module.exports = router;