const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

// Initialize Firebase Admin SDK and Realtime Database
initializeApp();
const db = getDatabase();

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// Configure email transport with your App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: "tcrown193@gmail.com", 
    pass: "dosidatybgdudnkz" 
  }
});

// Middleware to check if user is verified via Realtime Database
const checkVerified = async (req, res, next) => {
  const userEmail = req.headers["user-email"];
  if (!userEmail) return res.status(403).send("Access Denied: No user email provided.");

  try {
    // Sanitize email key for RTDB path (replace dots with commas)
    const emailKey = userEmail.replace(/\./g, ",");
    const snapshot = await db.ref(`users/${emailKey}`).once("value");
    
    if (!snapshot.exists()) return res.status(403).send("Access Denied: User not found.");
    
    const userData = snapshot.val();
    if (userData.verified) {
      req.user = userData;
      next();
    } else {
      res.status(403).send("Access Denied: Please verify your email.");
    }
  } catch (err) {
    res.status(500).send("Database error");
  }
};

app.get("/post", (req, res) => {
  res.send("server running!!!!");
});

// Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const emailKey = email.replace(/\./g, ",");
    const userRef = db.ref(`users/${emailKey}`);
    const snapshot = await userRef.once("value");

    if (snapshot.exists()) {
      return res.status(400).send("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = { 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      id: Date.now(), 
      verified: false, 
      verificationCode: code 
    };

    await userRef.set(newUser);

    await transporter.sendMail({
      from: "tcrown193@gmail.com", 
      to: email, 
      subject: "Verify Account",
      text: `Use this code to verify: ${code}`
    });

    res.status(200).send("Registered successfully. Please verify your email via the code sent.");
  } catch (err) {
    res.status(500).send("Error saving user");
  }
});

// Verify with Code Route
app.post("/api/verify-code", async (req, res) => {
  const { email, code } = req.body;
  try {
    const emailKey = email.replace(/\./g, ",");
    const userRef = db.ref(`users/${emailKey}`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) return res.status(400).send("Invalid code or email.");
    
    const user = snapshot.val();
    if (user.verificationCode === code) {
      await userRef.update({ 
        verified: true, 
        verificationCode: null 
      });
      res.status(200).send("Verified successfully!");
    } else {
      res.status(400).send("Invalid code or email.");
    }
  } catch (err) {
    res.status(500).send("Server error during verification.");
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailKey = email.replace(/\./g, ",");
    const snapshot = await db.ref(`users/${emailKey}`).once("value");

    if (!snapshot.exists()) return res.status(401).send("Invalid email or password");

    const user = snapshot.val();
    if (await bcrypt.compare(password, user.password)) {
      if (!user.verified) return res.status(403).send("Please verify your email first.");
      res.status(200).send({ message: "Login successful", user });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    res.status(500).send("Server error during login.");
  }
});

// Protected Marketplace Route
app.get("/api/products", checkVerified, (req, res) => {
  res.json({ message: "Welcome to the marketplace!", products: [] });
});

// Serve products catalog from Realtime Database (`/products` node)
app.get("/api/products-catalog", checkVerified, async (req, res) => {
  try {
    const snapshot = await db.ref("products").once("value");
    const productsData = snapshot.val() || {};
    const products = Array.isArray(productsData) ? productsData : Object.values(productsData);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send("Error reading products catalog.");
  }
});

// Export the Express app as a Firebase Cloud Function (V2)
exports.api = onRequest(app);

// Explicit port listener required for Cloud Run container health checks
const port = process.env.PORT || 8313;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});