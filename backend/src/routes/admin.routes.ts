import express from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware to check if user is SUPERADMIN
const requireSuperAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'SUPERADMIN') {
    return res.status(403).json({ message: 'Access denied: Super Admin only' });
  }
  next();
};

// ==========================================
// SUPER ADMIN DATA ROUTES
// ==========================================

// Get all users (Applicants and Managers)
router.get('/users', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['APPLICANT', 'MANAGER']
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        locationPreference: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Optionally, get dashboard stats
router.get('/stats', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const totalApplicants = await prisma.user.count({ where: { role: 'APPLICANT' } });
    const totalManagers = await prisma.user.count({ where: { role: 'MANAGER' } });
    const totalJobs = await prisma.job.count();
    const totalApplications = await prisma.application.count();

    res.json({
      totalApplicants,
      totalManagers,
      totalJobs,
      totalApplications
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

export default router;
