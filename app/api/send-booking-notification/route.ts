import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const formData = await request.json();

    if (!formData.firstName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h1 style="color: #1e3a8a; text-align: center;">New Booking Request</h1>
        <p style="font-size: 16px; text-align: center;">You have received a new booking request from <strong>${formData.firstName} ${formData.lastName}</strong>.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Travel Type:</strong> ${formData.travelType || 'Not specified'}</p>
          <p><strong>Expected Date:</strong> ${formData.expectedDate || 'Not specified'}</p>
          <p><strong>Nights:</strong> ${formData.nights || 'Not specified'}</p>
          <p><strong>Adults:</strong> ${formData.adults || 'Not specified'}</p>
          <p><strong>Children:</strong> ${formData.children || '0'}</p>
          <p><strong>Budget:</strong> ${formData.budget || 'Not specified'}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://abmtours.co.tz/admin/Bookings" 
            style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            View Booking Details
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          This is an automated notification from ABM Tours booking system.
        </p>
      </div>
    `;

    // DIRECTADMIN SMTP CONFIGURATION
    // Use port 465 with SSL (port 587 with STARTTLS also works but 465 is more reliable)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,                    // Standard DirectAdmin SSL port
      secure: true,                 // Required for port 465
      auth: {
        user: process.env.EMAIL_USER,      // Must be full email address
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,         // Accept self-signed certificates
        minVersion: 'TLSv1.2',             // DirectAdmin requires TLS 1.2+
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    // Verify connection before sending
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: `"ABM Tours" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Booking Request from ${formData.firstName} ${formData.lastName}`,
      html: emailHtml,
      text: `New booking request from ${formData.firstName} ${formData.lastName}. Email: ${formData.email}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return NextResponse.json(
      { success: true, message: 'Email notification sent successfully' },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Email error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}