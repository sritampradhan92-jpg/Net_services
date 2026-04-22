const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getAdminSetupStatus,
  signupAdmin,
  loginAdmin,
  getRegistrations,
  getRequestCalls,
  getContacts,
  updateStatus,
  deleteRegistration,
  deleteRequestCall,
  deleteContact,
} = require("../controllers/adminController");

// Public
router.get("/setup-status", getAdminSetupStatus);
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/registrations", authMiddleware, getRegistrations);
router.get("/request-calls", authMiddleware, getRequestCalls);
router.get("/contacts", authMiddleware, getContacts);
router.delete("/request-calls/:id", authMiddleware, deleteRequestCall);
router.delete("/contacts/:id", authMiddleware, deleteContact);
router.patch("/update-status/:id", authMiddleware, updateStatus);
router.delete("/delete/:id", authMiddleware, deleteRegistration);

module.exports = router;
