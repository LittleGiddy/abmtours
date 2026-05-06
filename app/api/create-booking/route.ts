// app/api/create-booking/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// Helper to format current local time (East Africa Time, UTC+3)
const getLocalTimeString = () => {
  return new Date().toLocaleString('en-TZ', {
    timeZone: 'Africa/Dar_es_Salaam',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

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
    const client = await getClientPromise();
    const db = client.db('abmtours');

    const createdAt = new Date(); // UTC
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
      createdAt,
      status: 'pending',
    };

    const result = await db.collection('bookings').insertOne(bookingData);
    console.log('Booking saved to database:', result.insertedId);

    // 2. SEND EMAIL NOTIFICATION
    let emailSent = false;
    let emailError = null;

    try {
      const localTime = getLocalTimeString();
      const formattedDate = new Date(expectedDate).toLocaleDateString('en-TZ', {
        timeZone: 'Africa/Dar_es_Salaam',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #1e3a8a; text-align: center;">📋 New Booking Request</h1>
          <p style="font-size: 16px; text-align: center;">You have received a new booking request from <strong>${firstName} ${lastName}</strong>.</p>
          <p style="text-align: center; color: #666;">Submitted on: <strong>${localTime}</strong> (East Africa Time)</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0;">📝 Booking Details</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Travel Type:</strong> ${travelType}</p>
            <p><strong>Expected Start Date:</strong> ${formattedDate}</p>
            <p><strong>Nights:</strong> ${nights}</p>
            <p><strong>Adults:</strong> ${adults}</p>
            <p><strong>Children:</strong> ${children}</p>
            <p><strong>Budget (USD):</strong> ${budget}</p>
            <p><strong>Accommodation:</strong> ${accommodation}</p>
            <p><strong>Airport Pickup:</strong> ${airportPickup}</p>
            <p><strong>Trip Enhancements:</strong> ${tripEnhancements.length ? tripEnhancements.join(', ') : 'None'}</p>
            <p><strong>Destinations:</strong> ${destinations.length ? destinations.join(', ') : 'None'}</p>
            ${additionalInfo ? `<p><strong>Additional Info:</strong> ${additionalInfo}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://abmtours.co.tz/admin/Bookings" 
              style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification from ABM Tours booking system. Sent at ${localTime}.
          </p>
        </div>
      `;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
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
        subject: `📅 New Booking from ${firstName} ${lastName} - ${new Date().toLocaleDateString()}`,
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