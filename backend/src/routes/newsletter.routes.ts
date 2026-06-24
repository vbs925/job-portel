import { Router, Request, Response } from 'express';
import { sendSubscriptionEmail } from '../lib/email';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Send the subscription email asynchronously
    await sendSubscriptionEmail(email);

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful!' 
    });
  } catch (error: any) {
    console.error('Newsletter Subscription Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

export default router;
