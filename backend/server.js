import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// 1. Connect to MongoDB Atlas using your environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas successfully"))
  .catch(err => console.error("Database connection error:", err));

// 2. Define a User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: Number, required: true },
  verified: { type: Boolean, default: false },
  verificationCode: String,
  resetCode: String
});

const User = mongoose.model('User', userSchema);

// Allow requests from your frontend and local development
app.use(cors({
  origin: ['https://triple-crown-store.web.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: { 
    user: 'tcrown193@gmail.com', 
    pass: 'dosidatybgdudnkz' 
  },
  family: 4 
});

// Middleware to authenticate JWT token from headers
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) return res.status(401).send("Access Denied: No token provided.");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid or expired token.");
    req.user = user; // Contains user id/email payload
    next();
  });
};

// Middleware to check if user is verified (can work alongside token authentication)
const checkVerified = async (req, res, next) => {
  const userEmail = req.headers['user-email']; 
  try {
    const user = await User.findOne({ email: userEmail });
    if (user && user.verified) next();
    else res.status(403).send("Access Denied: Please verify your email.");
  } catch (err) {
    res.status(500).send("Database error");
  }
};

// ==========================================
// 3. Products Catalog API Endpoint (Reading from products.json)
// ==========================================
app.get('/api/products-catalog', authenticateToken, (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'products.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const productsData = JSON.parse(rawData);

    res.status(200).json(productsData);
  } catch (err) {
    console.error("Error reading products.json:", err);
    res.status(500).send("Failed to load products catalog from file.");
  }
});
// ==========================================
// Secure Client Profile Endpoint
// ==========================================
app.get('/api/client-profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationCode -resetCode');
    if (!user) return res.status(404).send("User profile not found.");
    
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching client profile:", err);
    res.status(500).send("Server error while retrieving profile.");
  }
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).send("Triple Crown Backend API is running successfully!");
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newUser = new User({ 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      id: Date.now(), 
      verified: false, 
      verificationCode: code 
    });

    await newUser.save();

    await transporter.sendMail({
      from: 'tcrown193@gmail.com', 
      to: email, 
      subject: 'Action Required: Verify Your Triple Crown Account',
      text: `Hello ${name},\n\nThank you for registering with Triple Crown. To complete your account setup and activate your profile, please use your secure verification code or click the activation link below:\n\nVerification Code: ${code}\n\nActivation Link: Please enter your verification code directly on the verification page.\n\nIf you have any questions or did not initiate this request, please feel free to reach out to our support team.\n\nBest regards,\nThe Triple Crown Team`
    });
    
    res.status(200).send("Registered successfully. Please check your email for the verification code.");
  } catch (emailErr) {
    console.error("Registration/Email error:", emailErr);
    res.status(500).send("Error processing registration.");
  }
});

// Verify with Code Route
app.post('/api/verify-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email, verificationCode: code });
    if (user) {
      user.verified = true;
      user.verificationCode = undefined; 
      await user.save();
      res.status(200).send("Verified successfully!");
    } else {
      res.status(400).send("Invalid verification code or email.");
    }
  } catch (err) {
    res.status(500).send("Server error during verification.");
  }
});

// Login Route (Generates JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.verified) return res.status(403).send("Please verify your email first.");
      
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

      const safeUserObject = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        verified: user.verified
      };

      res.status(200).json({ message: "Login successful", token, user: safeUserObject });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
});

// Resend Code Route
app.post('/api/resend-code', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    if (user.verified) return res.status(400).send("Account is already verified.");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    await user.save();

    await transporter.sendMail({
      from: 'tcrown193@gmail.com', 
      to: email, 
      subject: 'New Verification Code - Triple Crown',
      text: `Your new verification code is: ${code}`
    });
    res.status(200).send("Verification code resent successfully!");
  } catch (err) {
    res.status(500).send("Failed to resend code.");
  }
});

// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("No account found with this email.");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    await user.save();

    await transporter.sendMail({
      from: 'tcrown193@gmail.com',
      to: email,
      subject: 'Action Required: Password Reset Request - Triple Crown',
      text: `Hello,\n\nWe recently received a request to reset the password associated with your Triple Crown account.\n\nYour secure password reset code is: ${code}\n\nIf you did not request this password reset, please disregard this email. Your account remains secure and no changes will be made.\n\nBest regards,\nThe Triple Crown Team`
    });
    res.status(200).send("Reset code sent!");
  } catch (err) {
    res.status(500).send("Failed to send reset email.");
  }
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, resetCode: code });
    if (!user) return res.status(400).send("Invalid or expired reset code.");

    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.resetCode = undefined;
    await user.save();

    res.status(200).send("Password updated successfully!");
  } catch (err) {
    res.status(500).send("Server error during password reset.");
  }
});

// 4. Render Port Binding Fix
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});