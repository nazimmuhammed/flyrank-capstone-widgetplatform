const express = require("express");
const pool = require("../config/db");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

// GET all widgets
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM widgets
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [req.user.tenantId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch widgets" });
  }
});

// GET one widget
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM widgets
       WHERE id = $1 AND tenant_id = $2`,
      [req.params.id, req.user.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Widget not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch widget" });
  }
});

// CREATE widget
router.post("/", async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      form_fields,
      button_text,
      display_options
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        error: "type and title are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO widgets
       (tenant_id, type, title, description, form_fields, button_text, display_options)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.tenantId,
        type,
        title,
        description || null,
        JSON.stringify(form_fields || []),
        button_text || "Submit",
        JSON.stringify(display_options || {})
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create widget" });
  }
});

// UPDATE widget
router.put("/:id", async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      form_fields,
      button_text,
      display_options
    } = req.body;

    const result = await pool.query(
      `UPDATE widgets
       SET type = COALESCE($1, type),
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           form_fields = COALESCE($4, form_fields),
           button_text = COALESCE($5, button_text),
           display_options = COALESCE($6, display_options),
           updated_at = NOW()
       WHERE id = $7 AND tenant_id = $8
       RETURNING *`,
      [
        type || null,
        title || null,
        description || null,
        form_fields ? JSON.stringify(form_fields) : null,
        button_text || null,
        display_options ? JSON.stringify(display_options) : null,
        req.params.id,
        req.user.tenantId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Widget not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update widget" });
  }
});

// DELETE widget
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM widgets
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [req.params.id, req.user.tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Widget not found" });
    }

    res.json({
      message: "Widget deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete widget" });
  }
});

module.exports = router;