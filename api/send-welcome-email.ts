// Vercel Serverless Function: Send Welcome Email
// This runs on Vercel without needing Supabase Edge Functions
// Deploy to: /api/send-welcome-email

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, name } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }

    // Read the welcome email template
    const fs = require('fs');
    const path = require('path');
    
    let template = '';
    try {
      const templatePath = path.join(process.cwd(), 'supabase', 'templates', 'email-welcome.html');
      template = fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      // Fallback template
      template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to RMG Insight</title>
</head>
<body>
    <h1>Welcome to RMG Insight!</h1>
    <p>Hello ${name || 'there'},</p>
    <p>Welcome to RMG Insight! We're thrilled to have you join our community.</p>
    <p><a href="https://rmginsights.fabricxai.com">Go to Dashboard</a></p>
    <p>Best regards,<br>The RMG Insight Team</p>
</body>
</html>
      `;
    }

    // Replace template variables
    const emailContent = template
      .replace(/\{\{name\}\}/g, name || 'there')
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{year\}\}/g, new Date().getFullYear().toString())
      .replace(/\{\{dashboard_link\}\}/g, 'https://rmginsights.fabricxai.com')
      .replace(/\{\{privacy_link\}\}/g, 'https://rmginsights.fabricxai.com/privacy')
      .replace(/\{\{terms_link\}\}/g, 'https://rmginsights.fabricxai.com/terms');

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, just log it
    console.log('Welcome email would be sent to:', email);
    console.log('Email content length:', emailContent.length);

    // Example with Resend (uncomment and add API key):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'RMG Insight <noreply@rmginsights.fabricxai.com>',
      to: email,
      subject: 'Welcome to RMG Insight!',
      html: emailContent,
    });
    */

    return res.status(200).json({
      success: true,
      message: 'Welcome email queued for sending',
      email: email,
    });
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send welcome email',
    });
  }
}

