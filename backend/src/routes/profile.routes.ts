import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { upload } from '../middleware/upload';

router.use(authenticate);

// GET /profile/me
router.get('/me', async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        education: true,
        experience: true,
        skills: true,
        certificates: true,
        portfolio: true,
        locationPreference: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /profile/me
router.put('/me', async (req: any, res: any) => {
  try {
    const { name, education, experience, skills, certificates, portfolio, locationPreference } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        education: education || null,
        experience: experience || null,
        skills: skills || null,
        certificates: certificates || null,
        portfolio: portfolio || null,
        locationPreference: locationPreference || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        education: true,
        experience: true,
        skills: true,
        certificates: true,
        portfolio: true,
        locationPreference: true,
      }
    });
    
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /profile/me/password
router.put('/me/password', async (req: any, res: any) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /profile/me
router.delete('/me', async (req: any, res: any) => {
  try {
    // Delete user (cascade will handle applications, saved jobs, etc.)
    await prisma.user.delete({
      where: { id: req.user.id }
    });
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /profile/me/certificates/upload
router.post('/me/certificates/upload', upload.single('certificate'), async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Save to database
    const document = await prisma.document.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer
      }
    });
    
    const fileUrl = `/api/files/${document.id}`;
    
    res.json({ message: 'Certificate uploaded successfully', fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
