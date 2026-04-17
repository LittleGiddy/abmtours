export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb'; // ✅ named import
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements = [],
      accommodation,
      airportPickup,
      expectedDate,
      budget,
      nights,
      adults,
      children = "0",
      destinations = [],
      additionalInfo = "",
      agreeToTerms = false,
      agreeToInfo = false,
    } = body;

    // Required fields validation
    const missingFields = [];
    
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!travelType) missingFields.push('travelType');
    if (!accommodation) missingFields.push('accommodation');
    if (!airportPickup) missingFields.push('airportPickup');
    if (!expectedDate) missingFields.push('expectedDate');
    if (!budget) missingFields.push('budget');
    if (!nights) missingFields.push('nights');
    if (!adults) missingFields.push('adults');
    if (typeof agreeToInfo !== 'boolean') missingFields.push('agreeToInfo');
    if (typeof agreeToTerms !== 'boolean') missingFields.push('agreeToTerms');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    // 1. SAVE TO DATABASE
    const client = await getClientPromise(); // ✅ call it as a function  
    const db = client.db('abmtours');

    const bookingData = {
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements,
      accommodation,
      airportPickup,
      expectedDate,
      budget: Number(budget),
      nights: Number(nights),
      adults: Number(adults),
      children: children ? Number(children) : 0,
      destinations,
      additionalInfo,
      agreeToTerms,
      agreeToInfo,
      createdAt: new Date(),
      status: 'pending', // Add status for admin panel
    };

    const result = await db.collection('bookings').insertOne(bookingData);
    console.log('Booking saved to database:', result.insertedId);

    // 2. SEND EMAIL NOTIFICATION
    let emailSent = false;
    let emailError = null;

    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #1e3a8a; text-align: center;">New Booking Request</h1>
          <p style="font-size: 16px; text-align: center;">You have received a new booking request from <strong>${firstName} ${lastName}</strong>.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Travel Type:</strong> ${travelType || 'Not specified'}</p>
            <p><strong>Expected Date:</strong> ${expectedDate || 'Not specified'}</p>
            <p><strong>Nights:</strong> ${nights || 'Not specified'}</p>
            <p><strong>Adults:</strong> ${adults || 'Not specified'}</p>
            <p><strong>Children:</strong> ${children || '0'}</p>
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
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

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587, // Use the working port
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `"ABM Tours" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Booking Request from ${firstName} ${lastName}`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log('Email sent successfully');
    } catch (emailErr) {
      console.error('Email error:', emailErr);
      emailError = emailErr instanceof Error ? emailErr.message : 'Unknown email error';
      // Don't fail the whole request if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking saved successfully',
      bookingId: result.insertedId,
      emailSent: emailSent,
      emailError: emailError,
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}