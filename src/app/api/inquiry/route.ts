import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { resumeData } from '@/data/resumeData';

export const runtime = 'nodejs';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InquiryBody {
  sender_name?: unknown;
  sender_email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isValidLength(value: string, max: number): boolean {
  return value.length > 0 && value.length <= max;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL || resumeData.personalInfo.email;
  const fromEmail = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      {
        success: false,
        error: 'Inquiry delivery is not configured. Add RESEND_API_KEY and INQUIRY_FROM_EMAIL to the server environment.',
      },
      { status: 503 },
    );
  }

  let body: InquiryBody;
  try {
    body = (await request.json()) as InquiryBody;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot submissions are silently accepted so bots do not learn the field exists.
  if (cleanText(body.website)) {
    return NextResponse.json({ success: true, message: 'Inquiry received.' });
  }

  const senderName = cleanText(body.sender_name);
  const senderEmail = cleanText(body.sender_email).toLowerCase();
  const subject = cleanText(body.subject);
  const message = cleanText(body.message);

  if (
    !isValidLength(senderName, MAX_NAME_LENGTH) ||
    !isValidLength(senderEmail, MAX_EMAIL_LENGTH) ||
    !EMAIL_PATTERN.test(senderEmail) ||
    !isValidLength(subject, MAX_SUBJECT_LENGTH) ||
    !isValidLength(message, MAX_MESSAGE_LENGTH)
  ) {
    return NextResponse.json(
      { success: false, error: 'Please provide a valid name, email, subject, and message.' },
      { status: 400 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: `Narciso III Javier Portfolio <${fromEmail}>`,
      to: [toEmail],
      replyTo: senderEmail,
      subject: `[Portfolio Inquiry] ${subject}`,
      text: [
        `From: ${senderName}`,
        `Email: ${senderEmail}`,
        `Subject: ${subject}`,
        '',
        message,
      ].join('\n'),
      html: `
        <h2>Portfolio inquiry</h2>
        <p><strong>From:</strong> ${escapeHtml(senderName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
      `,
    });

    if (error) {
      console.error('[Inquiry] Resend rejected the message:', error);
      return NextResponse.json(
        { success: false, error: 'The email service rejected the inquiry. Please try again later.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully.',
      id: data?.id,
    });
  } catch (error) {
    console.error('[Inquiry] Delivery failed:', error);
    return NextResponse.json(
      { success: false, error: 'The inquiry could not be delivered. Please try again later.' },
      { status: 502 },
    );
  }
}
