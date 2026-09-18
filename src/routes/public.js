const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Public widget configuration
router.get("/widgets/:id/config", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, type, title, description, form_fields,
              button_text, display_options
       FROM widgets
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Widget not found" });
    }

    res.set("Cache-Control", "public, max-age=60");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to load widget" });
  }
});

module.exports = router;