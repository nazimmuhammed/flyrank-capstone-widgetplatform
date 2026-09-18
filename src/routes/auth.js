const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required"
      });
    }

    const result = await pool.query(
      "SELECT id, email, name FROM tenants WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const tenant = result.rows[0];

    const token = jwt.sign(
      {
        tenantId: tenant.id,
        email: tenant.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Login failed"
    });
  }
});

module.exports = router;