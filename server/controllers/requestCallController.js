const RequestCall = require("../models/RequestCall");

// POST /api/request-call – Public
const createRequestCall = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    const requestCall = await RequestCall.create({ name, phone });

    return res.status(201).json({
      success: true,
      message: "We will call you soon!",
      data: requestCall,
    });
  } catch (error) {
    console.error("Request call error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = { createRequestCall };
