import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email from NixFunds setup.'
}, (err, info) => {
  if (err) return console.error('Nodemailer error:', err);
  console.log('Email sent:', info.response);
});
