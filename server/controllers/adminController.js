const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Registration = require("../models/Registration");
const RequestCall = require("../models/RequestCall");

// GET /api/admin/setup-status – Public
const getAdminSetupStatus = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    return res.status(200).json({
      success: true,
      hasAdmin: adminCount > 0,
    });
  } catch (error) {
    console.error("Admin setup status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// POST /api/admin/signup – Public (one-time setup)
const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists. Only one admin account is allowed.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin signup successful. You can now sign in.",
      data: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Admin signup error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// POST /api/admin/login – Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// GET /api/admin/registrations – Protected
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error("Fetch registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// GET /api/admin/request-calls – Protected
const getRequestCalls = async (req, res) => {
  try {
    const requestCalls = await RequestCall.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requestCalls.length,
      data: requestCalls,
    });
  } catch (error) {
    console.error("Fetch request calls error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// PATCH /api/admin/update-status/:id – Protected
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: registration,
    });
  } catch (error) {
    console.error("Update status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// DELETE /api/admin/delete/:id – Protected
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    console.error("Delete error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// DELETE /api/admin/request-calls/:id – Protected
const deleteRequestCall = async (req, res) => {
  try {
    const { id } = req.params;

    const requestCall = await RequestCall.findByIdAndDelete(id);

    if (!requestCall) {
      return res.status(404).json({
        success: false,
        message: "Request call not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request call deleted successfully.",
    });
  } catch (error) {
    console.error("Delete request call error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  getAdminSetupStatus,
  signupAdmin,
  loginAdmin,
  getRegistrations,
  getRequestCalls,
  updateStatus,
  deleteRegistration,
  deleteRequestCall,
};
