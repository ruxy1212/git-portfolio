import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        { error: 'Missing request body' },
        { status: 400 },
      );
    }

    const { fullName, email, message, recipient } = JSON.parse(body);

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    await sendEmail({ fullName, email, message, recipient });
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to send email',
          message: error?.message || 'Unknown error',
          stack: error?.stack || null,
        },
        { status: 500 },
      );
    }
  }
}
