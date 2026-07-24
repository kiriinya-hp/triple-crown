import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Connect to your MongoDB Atlas
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  id: Number,
  verified: Boolean,
  verificationCode: String,
  resetCode: String
});

const User = mongoose.model('User', userSchema);

async function migrateData() {
  try {
    // Read your local users.json file
    const data = fs.readFileSync('./users.json', 'utf8');
    const users = JSON.parse(data);

    if (users.length === 0) {
      console.log("No users found in users.json to migrate.");
      process.exit();
    }

    // Insert them into MongoDB
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Migrated user: ${u.email}`);
      } else {
        console.log(`User already exists in DB: ${u.email}`);
      }
    }

    console.log("Migration completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateData();