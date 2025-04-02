// src/utils/emailUtils.js
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Helper to load the HTML template
const loadTemplate = (templatePath, replacements) => {
  let template = fs.readFileSync(path.resolve(templatePath), 'utf-8');

  // Replace placeholders in the template
  for (let key in replacements) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }

  return template;
};

// Send email with an HTML template
export const sendEmail = async (to, subject, templatePath, replacements) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = loadTemplate(templatePath, replacements);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html, // HTML body of the email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
