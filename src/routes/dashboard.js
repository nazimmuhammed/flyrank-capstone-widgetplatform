const express = require("express");
const pool = require("../config/db");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

// All submissions for the authenticated tenant
router.get("/submissions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, widget_id, data, country, city, created_at
       FROM submissions
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.user.tenantId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch submissions"
    });
  }
});

// Basic analytics
router.get("/stats", async (req, res) => {
  try {
    const total = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM submissions
       WHERE tenant_id = $1`,
      [req.user.tenantId]
    );

    const byWidget = await pool.query(
      `SELECT widget_id, COUNT(*)::int AS submissions
       FROM submissions
       WHERE tenant_id = $1
       GROUP BY widget_id
       ORDER BY submissions DESC`,
      [req.user.tenantId]
    );

    const byCountry = await pool.query(
      `SELECT country, COUNT(*)::int AS submissions
       FROM submissions
       WHERE tenant_id = $1
       GROUP BY country
       ORDER BY submissions DESC`,
      [req.user.tenantId]
    );

    res.json({
      total: total.rows[0].total,
      by_widget: byWidget.rows,
      by_country: byCountry.rows
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch statistics"
    });
  }
});

module.exports = router;