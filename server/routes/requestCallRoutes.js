const express = require("express");
const router = express.Router();
const { createRequestCall } = require("../controllers/requestCallController");

// POST /api/request-call
router.post("/", createRequestCall);

module.exports = router;
