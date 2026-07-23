import express from 'express';
import fs from 'fs';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const saltRounds = 10;
const filePath = './users.json';

// Allow requests from your Firebase frontend
app.use(cors({
  origin: ['https://triple-crown-store.web.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Configure email transport with your App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: 'tcrown193@gmail.com', 
    pass: 'dosidatybgdudnkz' 
  }
});

// Middleware to check if user is verified
const checkVerified = (req, res, next) => {
  const userEmail = req.headers['user-email']; 
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Database error");
    const users = JSON.parse(data || '[]');
    const user = users.find(u => u.email === userEmail);
    if (user && user.verified) next();
    else res.status(403).send("Access Denied: Please verify your email.");
  });
};

app.get("/post", (req, res) => {
  res.send("server running!!!!");
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  fs.readFile(filePath, 'utf8', async (err, data) => {
    const users = err ? [] : JSON.parse(data || '[]');
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).send("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
    const newUser = { name, email, phone, password: hashedPassword, id: Date.now(), verified: false, verificationCode: code };

    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users, null, 2), async (err) => {
      if (err) return res.status(500).send("Error saving user");
      
      const baseUrl = req.protocol + '://' + req.get('host');

      try {
        await transporter.sendMail({
          from: 'tcrown193@gmail.com', 
          to: email, 
          subject: 'Verify Account - Triple Crown',
          text: `Click to verify: ${baseUrl}/api/verify/${newUser.id} OR use this code: ${code}`
        });
        res.status(200).send("Registered successfully. Please verify your email via the link or code sent.");
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
        res.status(500).send("User registered, but failed to send verification email.");
      }
    });
  });
});

// Verify with Code Route
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    let users = JSON.parse(data || '[]');
    const user = users.find(u => u.email === email && u.verificationCode === code);
    if (user) {
      user.verified = true;
      delete user.verificationCode; 
      fs.writeFile(filePath, JSON.stringify(users, null, 2), () => res.status(200).send("Verified successfully!"));
    } else res.status(400).send("Invalid code or email.");
  });
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  fs.readFile(filePath, 'utf8', async (err, data) => {
    const users = JSON.parse(data || '[]');
    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.verified) return res.status(403).send("Please verify your email first.");
      res.status(200).send({ message: "Login successful", user });
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
});

// Verification Route (Link)
app.get('/api/verify/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  fs.readFile(filePath, 'utf8', (err, data) => {
    let users = JSON.parse(data || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      user.verified = true;
      delete user.verificationCode;
      fs.writeFile(filePath, JSON.stringify(users, null, 2), () => res.send("<h1>Verified Successfully! You can now close this tab and log in.</h1>"));
    } else res.status(404).send("User not found.");
  });
});

// Protected Marketplace Route
app.get('/api/products', checkVerified, (req, res) => {
  res.json({ message: "Welcome to the marketplace!", products: [] });
});

// Serve products catalog from products.json
app.get('/api/products-catalog', checkVerified, (req, res) => {
  fs.readFile('./products.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading products catalog.");
    res.status(200).json(JSON.parse(data));
  });
});

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});