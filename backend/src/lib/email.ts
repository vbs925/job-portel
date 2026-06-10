import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

async function initTransporter() {
  if (!transporter) {
    // If real SMTP credentials are provided, use them!
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // Defaulting to Gmail for ease of use
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('Real Email Transporter initialized with provided SMTP credentials.');
    } else {
      // Fallback to test Ethereal account if no real credentials provided
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
        console.log('Test Email Transporter initialized with Ethereal');
      } catch (err) {
        console.error('Failed to initialize Ethereal test account:', err);
      }
    }
  }
  return transporter;
}

export const sendApplicationConfirmationEmail = async (candidateEmail: string, candidateName: string, jobTitle: string) => {
  const t = await initTransporter();
  
  if (!t) {
    console.log(`[EMAIL SIMULATION] To: ${candidateEmail}`);
    console.log(`[EMAIL SIMULATION] Subject: Thank you for applying for ${jobTitle}`);
    return;
  }

  try {
    const info = await t.sendMail({
      from: process.env.SMTP_USER ? `"TechCorp India ATS" <${process.env.SMTP_USER}>` : '"TechCorp India ATS" <careers@techcorp.in>',
      to: candidateEmail,
      subject: `Application Received: ${jobTitle}`,
      text: `Dear ${candidateName},\n\nThank you for applying for the ${jobTitle} position at TechCorp India.\n\nWe have received your application, resume, and details successfully. Our hiring team will review your profile and get back to you shortly.\n\nBest regards,\nTechCorp India Hiring Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Application Received!</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at TechCorp India.</p>
          <p>We have successfully received your application, resume, and details. Our hiring team is currently reviewing your profile and will get back to you shortly regarding the next steps.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>TechCorp India Hiring Team</strong></p>
        </div>
      `
    });

    console.log("Confirmation email sent: %s", info.messageId);
    if (!process.env.SMTP_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
};

export const sendInterviewEmail = async (candidateEmail: string, candidateName: string, jobTitle: string, dateStr: string, timeStr: string, link: string) => {
  const t = await initTransporter();
  if (!t) return;
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_USER ? `"TechCorp India ATS" <${process.env.SMTP_USER}>` : '"TechCorp India ATS" <careers@techcorp.in>',
      to: candidateEmail,
      subject: `Interview Scheduled: ${jobTitle}`,
      text: `Dear ${candidateName},\n\nWe are pleased to invite you to an interview for the ${jobTitle} position.\n\nDate: ${dateStr}\nTime: ${timeStr}\nMeeting Link: ${link}\n\nBest regards,\nTechCorp India Hiring Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Interview Scheduled!</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>We are pleased to invite you to an interview for the <strong>${jobTitle}</strong> position.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeStr}</p>
            <p><strong>Meeting Link:</strong> <a href="${link}">${link}</a></p>
          </div>
          <p>Best regards,</p>
          <p><strong>TechCorp India Hiring Team</strong></p>
        </div>
      `
    });
    console.log("Interview email sent: %s", info.messageId);
    if (!process.env.SMTP_USER) console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send interview email:", error);
  }
};

export const sendStageUpdateEmail = async (candidateEmail: string, candidateName: string, jobTitle: string, newStage: string) => {
  const t = await initTransporter();
  if (!t) return;
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_USER ? `"TechCorp India ATS" <${process.env.SMTP_USER}>` : '"TechCorp India ATS" <careers@techcorp.in>',
      to: candidateEmail,
      subject: `Application Update: ${jobTitle}`,
      text: `Dear ${candidateName},\n\nGreat news! Your application for ${jobTitle} has been moved to the ${newStage} stage.\n\nOur team will be in touch with you shortly with next steps.\n\nBest regards,\nTechCorp India Hiring Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Application Update</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Great news! Your application for <strong>${jobTitle}</strong> has been moved to the <strong style="color: #4CAF50;">${newStage}</strong> stage.</p>
          <p>Our team will be in touch with you shortly with next steps.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>TechCorp India Hiring Team</strong></p>
        </div>
      `
    });
    console.log("Stage update email sent: %s", info.messageId);
    if (!process.env.SMTP_USER) console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send stage update email:", error);
  }
};

export const sendOfferEmail = async (candidateEmail: string, candidateName: string, jobTitle: string, companyName: string = "TechCorp India") => {
  const t = await initTransporter();
  if (!t) return;
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_USER ? `"TechCorp India ATS" <${process.env.SMTP_USER}>` : '"TechCorp India ATS" <careers@techcorp.in>',
      to: candidateEmail,
      subject: `Formal Job Offer: ${jobTitle} at ${companyName}`,
      text: `Dear ${candidateName},\n\nWe are incredibly excited to extend a formal offer of employment for the position of ${jobTitle} at ${companyName}.\n\nPlease find the details in the HTML version of this email.`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">${companyName}</h1>
            <p style="color: #6b7280; margin-top: 5px; font-size: 14px;">Official Offer of Employment</p>
          </div>
          
          <p>Dear <strong>${candidateName}</strong>,</p>
          
          <p>Following our recent interviews and discussions, we are absolutely thrilled to extend a formal offer of employment to you for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          
          <p>Throughout the interview process, our entire team was thoroughly impressed with your background, skills, and the unique perspective you will bring to our company. We believe that you will be a tremendous asset to our organization and that you will play a key role in our future success.</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 30px; color: #1f2937;">Offer Highlights</h3>
          <ul style="line-height: 1.6; color: #4b5563;">
            <li><strong>Role:</strong> ${jobTitle}</li>
            <li><strong>Company:</strong> ${companyName}</li>
            <li><strong>Start Date:</strong> To be mutually agreed upon</li>
            <li><strong>Benefits:</strong> Comprehensive health insurance, flexible working hours, and performance bonuses.</li>
          </ul>
          
          <p style="margin-top: 30px;">Our HR department will be reaching out to you shortly via a separate email to provide the comprehensive employment agreement, detailed compensation breakdown, and onboarding schedule.</p>
          
          <p>We kindly request that you review the upcoming documentation and confirm your acceptance. Should you have any questions or require further clarification before making your decision, please do not hesitate to reach out directly to your hiring manager.</p>
          
          <p>We are very excited about the prospect of you joining us and look forward to welcoming you to the team!</p>
          
          <br/>
          <p>Warmest congratulations,</p>
          <p style="margin-bottom: 0;"><strong>The Executive Team</strong></p>
          <p style="margin-top: 5px; color: #6b7280;">${companyName}</p>
        </div>
      `
    });
    console.log("Offer email sent: %s", info.messageId);
    if (!process.env.SMTP_USER) console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send offer email:", error);
  }
};

export const sendRejectionEmail = async (candidateEmail: string, candidateName: string, jobTitle: string) => {
  const t = await initTransporter();
  if (!t) return;
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_USER ? `"TechCorp India ATS" <${process.env.SMTP_USER}>` : '"TechCorp India ATS" <careers@techcorp.in>',
      to: candidateEmail,
      subject: `Update on your application for ${jobTitle}`,
      text: `Dear ${candidateName},\n\nThank you for applying to the ${jobTitle} position at TechCorp India.\n\nWhile your background is impressive, we have decided to move forward with other candidates who more closely match our current requirements.\n\nWe appreciate your time and wish you the best in your job search.\n\nBest regards,\nTechCorp India Hiring Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying to the <strong>${jobTitle}</strong> position at TechCorp India.</p>
          <p>While your background is impressive, we have decided to move forward with other candidates who more closely match our current requirements for this particular role.</p>
          <p>We appreciate the time you took to apply and interview with us, and we wish you the very best in your job search.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>TechCorp India Hiring Team</strong></p>
        </div>
      `
    });
    console.log("Rejection email sent: %s", info.messageId);
    if (!process.env.SMTP_USER) console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
};
