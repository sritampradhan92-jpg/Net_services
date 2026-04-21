const Registration = require("../models/Registration");

// POST /api/register – Public
const createRegistration = async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required.",
      });
    }

    const registration = await Registration.create({
      name,
      phone,
      email,
      service: service || "General Service",
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully!",
      data: registration,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = { createRegistration };
