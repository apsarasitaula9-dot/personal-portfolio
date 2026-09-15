// Vercel Serverless Function: api/contact.js
// Handles portfolio contact form submissions and sends emails via Resend.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject anything that is not POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please submit via POST.',
    });
  }

  try {
    // Parse body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON request body.',
        });
      }
    }

    const { name, email, subject, message, _gotcha } = body || {};

    // 1. Honeypot check for spam bots
    if (_gotcha) {
      // Return 200 without sending email so spam bots think it succeeded
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully.',
      });
    }

    // 2. Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name.',
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your email address.',
      });
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your message.',
      });
    }

    // Length safety limits
    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name must not exceed 100 characters.',
      });
    }

    if (trimmedEmail.length > 254) {
      return res.status(400).json({
        success: false,
        error: 'Email address must not exceed 254 characters.',
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message must not exceed 2000 characters.',
      });
    }

    // Format human-friendly subject
    const subjectMap = {
      'web-design': 'Web Design & Development',
      'graphic-design': 'Graphic Design & Branding',
      'game-dev': 'Game / Interactive Project',
      'general': 'General Collaboration / Inquiries',
    };
    const cleanedSubject = (subject && subjectMap[subject]) || (typeof subject === 'string' && subject.trim()) || 'General Inquiry';
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    // 3. Check for Resend API Key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('[Contact API] Error: Missing RESEND_API_KEY environment variable.');
      return res.status(500).json({
        success: false,
        error: 'Email service configuration error: RESEND_API_KEY is not set in environment variables.',
      });
    }

    const toEmail = process.env.TO_EMAIL || 'apsarasitaula9@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // Build email templates
    const emailSubject = `[Portfolio Inquiry] ${cleanedSubject} - from ${trimmedName}`;
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeSubject = escapeHtml(cleanedSubject);
    const safeMessage = escapeHtml(trimmedMessage);
    const submissionDate = new Date().toUTCString();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #FBF7F8;
      margin: 0;
      padding: 24px;
      color: #181517;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #F1E5E9;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #C2255C, #E03177);
      padding: 28px 32px;
      color: #FFFFFF;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .header p {
      margin: 6px 0 0 0;
      opacity: 0.92;
      font-size: 13.5px;
    }
    .body {
      padding: 32px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .meta-table td {
      padding: 10px 0;
      border-bottom: 1px solid #F6EDF0;
      font-size: 14px;
      vertical-align: top;
    }
    .meta-table .label {
      font-weight: 700;
      color: #8F7B83;
      width: 90px;
      text-transform: uppercase;
      font-size: 11.5px;
      letter-spacing: 0.05em;
    }
    .meta-table .val {
      color: #181517;
      font-weight: 600;
    }
    .meta-table .val a {
      color: #C2255C;
      text-decoration: none;
    }
    .section-title {
      font-weight: 700;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #8F7B83;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    .message-box {
      background: #FFF8FA;
      border-left: 4px solid #C2255C;
      padding: 18px 20px;
      border-radius: 0 10px 10px 0;
      font-size: 14.5px;
      line-height: 1.65;
      color: #2D272A;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .reply-wrap {
      text-align: center;
      margin-top: 28px;
    }
    .reply-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #C2255C;
      color: #FFFFFF !important;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13.5px;
    }
    .footer {
      padding: 20px 32px;
      background: #FAF3F5;
      font-size: 12px;
      color: #8F7B83;
      text-align: center;
      border-top: 1px solid #F1E5E9;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>Received through your personal portfolio contact form</p>
    </div>
    <div class="body">
      <table class="meta-table">
        <tr>
          <td class="label">Sender</td>
          <td class="val"><strong>${safeName}</strong></td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="val"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Subject</td>
          <td class="val">${safeSubject}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="val">${submissionDate}</td>
        </tr>
      </table>

      <div class="section-title">Message</div>
      <div class="message-box">${safeMessage}</div>

      <div class="reply-wrap">
        <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(cleanedSubject)}" class="reply-btn">
          Reply Directly to ${safeName}
        </a>
      </div>
    </div>
    <div class="footer">
      Sent from your portfolio contact form. You can also click "Reply" directly in your email app.
    </div>
  </div>
</body>
</html>`;

    const textContent = `New Portfolio Inquiry

From: ${trimmedName} (${trimmedEmail})
Subject: ${cleanedSubject}
Date: ${submissionDate}

Message:
${trimmedMessage}

--------------------------------------------------
To reply directly, reply to this email or write to ${trimmedEmail}.`;

    // 4. Send email via Resend REST API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: trimmedEmail,
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('[Contact API] Resend API error response:', resendData);
      const resendMsg =
        resendData?.message ||
        resendData?.error?.message ||
        resendData?.error ||
        'Failed to deliver email through provider.';
      return res.status(resendResponse.status).json({
        success: false,
        error: resendMsg,
      });
    }

    // Success!
    return res.status(200).json({
      success: true,
      message: 'Email delivered successfully.',
      id: resendData.id,
    });
  } catch (error) {
    console.error('[Contact API] Unexpected error handling submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while sending your message. Please try again later.',
    });
  }
};
