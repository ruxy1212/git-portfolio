import nodemailer from 'nodemailer';

export async function sendEmail({
  fullName,
  email,
  message,
  recipient = null,
}: {
  fullName: string;
  email: string;
  message: string;
  recipient?: string | null;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Contact Form <${process.env.EMAIL_USER}>`,
    to: recipient || process.env.EMAIL_TO,
    subject: `New Contact Form Submission from ${fullName}`,
    text: `
      Name: ${fullName}
      Email: ${email}
      Message: ${message}
    `,
  };

  await transporter.sendMail(mailOptions);
}
