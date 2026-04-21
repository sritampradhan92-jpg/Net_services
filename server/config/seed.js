const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    const existingAdmin = await Admin.findOne({ email: "admin@netcom.com" });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    await Admin.create({
      email: "admin@netcom.com",
      password: hashedPassword,
    });

    console.log("Admin seeded successfully!");
    console.log("Email: admin@netcom.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
