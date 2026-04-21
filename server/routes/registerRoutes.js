const express = require("express");
const router = express.Router();
const { createRegistration } = require("../controllers/registerController");

// POST /api/register
router.post("/", createRegistration);

module.exports = router;
