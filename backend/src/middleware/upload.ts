import multer from 'multer';
import path from 'path';
import fs from 'fs';

// We use memory storage so files are available as Buffers in req.file.buffer
// This allows us to save them directly to the database instead of the local filesystem.
const storage = multer.memoryStorage();

// File filter for PDF, DOC, DOCX
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
  }
};

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});
