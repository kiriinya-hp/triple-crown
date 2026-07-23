import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const saltRounds = 10;
const filePath = path.resolve('./users.json');
const productsFilePath = path.resolve('./products.json');

// Ensure users.json and products.json exist on startup to prevent read errors
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// Allow requests from your Firebase frontend and local development
app.use(cors({
  origin: ['https://triple-crown-store.web.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Configure email transport with your Gmail App Password
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

// Register Route & Email Code Dispatcher
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
    const newUser = { 
      name, 
      email, 
      phone, 
      password: hashedPassword, 
      id: Date.now(), 
      verified: false, 
      verificationCode: code 
    };

    users.push(newUser);
    
    fs.writeFile(filePath, JSON.stringify(users, null, 2), async (writeErr) => {
      if (writeErr) {
        console.error("Error saving user profile:", writeErr);
        return res.status(500).send("Error saving user database.");
      }
      
      const baseUrl = req.protocol + '://' + req.get('host');

      try {
        // Send email containing the verification code
        await transporter.sendMail({
          from: 'tcrown193@gmail.com', 
          to: email, 
          subject: 'Verify Your Account - Triple Crown',
          text: `Hello ${name},\n\nThank you for registering with Triple Crown! Please use the following 6-digit verification code to activate your account:\n\nVerification Code: ${code}\n\nOr click this link: ${baseUrl}/api/verify/${newUser.id}\n\nBest regards,\nTriple Crown Team`
        });
        
        res.status(200).send("Registered successfully. Please check your email for the verification code.");
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
      fs.writeFile(filePath, JSON.stringify(users, null, 2), () => {
        res.status(200).send("Verified successfully!");
      });
    } else {
      res.status(400).send("Invalid verification code or email.");
    }
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
      fs.writeFile(filePath, JSON.stringify(users, null, 2), () => {
        res.send("<h1>Verified Successfully! You can now close this tab and log in.</h1>");
      });
    } else {
      res.status(404).send("User not found.");
    }
  });
});

// Protected Marketplace Route
app.get('/api/products', checkVerified, (req, res) => {
  res.json({ message: "Welcome to the marketplace!", products: [] });
});

// ==========================================
// PRODUCTS CATALOG ROUTES
// ==========================================

// Serve products catalog from products.json to authenticated users
app.get('/api/products-catalog', checkVerified, (req, res) => {
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading products.json:", err);
      return res.status(500).send("Error reading products catalog.");
    }
    try {
      const catalog = JSON.parse(data || '{}');
      res.status(200).json(catalog);
    } catch (parseError) {
      res.status(500).send("Invalid products configuration format.");
    }
  });
});

// Optional: Endpoint to update/save the products catalog JSON structure
app.post('/api/products-catalog', checkVerified, (req, res) => {
  const updatedCatalog = req.body;
  fs.writeFile(productsFilePath, JSON.stringify(updatedCatalog, null, 2), (err) => {
    if (err) {
      console.error("Error writing to products.json:", err);
      return res.status(500).send("Failed to update products catalog.");
    }
    res.status(200).send("Products catalog updated successfully!");
  });
});

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});