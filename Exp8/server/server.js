const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed demo users on first run
const seedDemoUsers = async () => {
  const demos = [
    { name: 'Admin',     email: 'admin@example.com',     password: 'admin123',     role: 'admin' },
    { name: 'Moderator', email: 'mod@example.com',        password: 'mod123',       role: 'moderator' },
    { name: 'User',      email: 'user@example.com',       password: 'user123',      role: 'user' },
  ];
  try {
    for (const demo of demos) {
      const exists = await User.findOne({ email: demo.email });
      if (!exists) {
        await User.create(demo);
        console.log(`🌱 Demo seeded: ${demo.email} / ${demo.password} (${demo.role})`);
      }
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

// Start server
const start = async () => {
  await connectDB();
  await seedDemoUsers();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
