import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import applicationsRoutes from './routes/applications.routes';
import managerJobsRoutes from './routes/manager.jobs.routes';
import managerAtsRoutes from './routes/manager.ats.routes';
import managerActionsRoutes from './routes/manager.actions.routes';
import profileRoutes from './routes/profile.routes';
import filesRoutes from './routes/files.routes';
import onboardingRoutes from './routes/onboarding.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import atsRoutes from './routes/ats.routes';
import newsletterRoutes from './routes/newsletter.routes';
import { startAtsCronService } from './services/atsCronService';
// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Job Portal API is running' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Applicant Routes
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Manager Routes
app.use('/api/manager/jobs', managerJobsRoutes);
app.use('/api/manager/ats', managerAtsRoutes);
app.use('/api/manager/actions', managerActionsRoutes);
app.use('/api/ai', aiRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// ATS routes
app.use('/api/ats-score', atsRoutes);

// Newsletter routes
app.use('/api/newsletter', newsletterRoutes);

// Global error handler (catches Multer file errors and other crashes)
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Global Error Caught:', err.message || err);
  res.status(400).json({ message: err.message || 'An unexpected server error occurred.' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the background ATS evaluator
  startAtsCronService();
});


server.on('error', (error) => {
  console.error('Server failed to start:', error);
});

// Keep process alive just in case
setInterval(() => {}, 1000 * 60 * 60);
