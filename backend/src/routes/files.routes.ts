import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();
// Route to serve files stored in the database

// GET /api/files/:id
router.get('/:id', async (req: any, res: any) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    });

    if (!document) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', document.mimetype);
    res.set('Content-Disposition', `inline; filename="${document.filename}"`);
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error while fetching file' });
  }
});

export default router;
