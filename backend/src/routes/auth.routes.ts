import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';

// Helper to generate tokens
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// ==========================================
// APPLICANT ROUTES
// ==========================================

router.post('/applicant/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Applicant
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'APPLICANT',
      },
    });

    res.status(201).json({
      message: 'Applicant registered successfully',
      token: generateToken(user.id, user.role),
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Applicant Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/applicant/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'APPLICANT') {
      return res.status(400).json({ message: 'Invalid credentials or incorrect portal' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Logged in successfully',
      token: generateToken(user.id, user.role),
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Applicant Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// HIRING MANAGER ROUTES
// ==========================================

router.post('/manager/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Manager
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'MANAGER',
      },
    });

    res.status(201).json({
      message: 'Manager registered successfully',
      token: generateToken(user.id, user.role),
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Manager Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/manager/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'MANAGER') {
      return res.status(400).json({ message: 'Invalid credentials or you are not a manager' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Manager logged in successfully',
      token: generateToken(user.id, user.role),
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Manager Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
