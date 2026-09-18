const express = require("express");
const pool = require("../config/db");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Try again later." }
});

router.post("/:widgetId", submissionLimiter, async (req, res) => {
  try {
    const { widgetId } = req.params;
    const { data, website } = req.body;

    // Honeypot spam protection
    if (website) {
      return res.status(400).json({ error: "Spam detected" });
    }

    // Basic boundary validation
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        error: "data must be an object"
      });
    }

    const payloadSize = JSON.stringify(req.body).length;

    if (payloadSize > 10000) {
      return res.status(413).json({
        error: "Payload too large"
      });
    }

    const widget = await pool.query(
      `SELECT id, tenant_id
       FROM widgets
       WHERE id = $1`,
      [widgetId]
    );

    if (widget.rows.length === 0) {
      return res.status(404).json({
        error: "Widget not found"
      });
    }

    const tenantId = widget.rows[0].tenant_id;

    // Safe geo enrichment
    let country = null;
    let city = null;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

    try {
      const response = await fetch(
        "http://ip-api.com/json/" + encodeURIComponent(ip || "")
      );

      if (response.ok) {
        const geo = await response.json();
        country = geo.country || null;
        city = geo.city || null;
      }
    } catch (error) {
      console.log("Geo provider A failed");
    }

    // Store submission regardless of enrichment failure
    const result = await pool.query(
      `INSERT INTO submissions
       (widget_id, tenant_id, data, ip_address, country, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, widget_id, data, country, city, created_at`,
      [
        widgetId,
        tenantId,
        JSON.stringify(data),
        ip,
        country,
        city
      ]
    );

    // Non-critical side effect
    try {
      console.log("Submission notification:", result.rows[0].id);
    } catch (error) {
      console.log("Notification failed safely");
    }

    res.status(201).json({
      success: true,
      submission: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to process submission"
    });
  }
});

module.exports = router;