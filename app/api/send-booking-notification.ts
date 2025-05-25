import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Verify content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const formData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format email content
    const formatField = (value: any) => {
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return value || 'Not specified';
    };

    const emailHtml = `
      <h1>New Booking Request</h1>
      <h2>From: ${formData.firstName} ${formData.lastName}</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><td><strong>Email:</strong></td><td>${formData.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${formatField(formData.phone)}</td></tr>
        <tr><td><strong>Travel Type:</strong></td><td>${formatField(formData.travelType)}</td></tr>
        <tr><td><strong>Accommodation:</strong></td><td>${formatField(formData.accommodation)}</td></tr>
        <tr><td><strong>Start Date:</strong></td><td>${formatField(formData.expectedDate)}</td></tr>
        <tr><td><strong>Nights:</strong></td><td>${formatField(formData.nights)}</td></tr>
        <tr><td><strong>Budget:</strong></td><td>${formatField(formData.budget)}</td></tr>
        <tr><td><strong>Adults:</strong></td><td>${formatField(formData.adults)}</td></tr>
        <tr><td><strong>Children:</strong></td><td>${formatField(formData.children)}</td></tr>
        <tr><td colspan="2"><strong>Additional Info:</strong></td></tr>
        <tr><td colspan="2">${formatField(formData.additionalInfo)}</td></tr>
      </table>
    `;

    // For now, just return success without actually sending email
    // This helps test if the API route is working correctly
    console.log('Would send email with content:', emailHtml);

    return NextResponse.json(
      { success: true, message: 'Email notification would be sent' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
