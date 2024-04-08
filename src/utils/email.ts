import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

export default async (payload: {
  from?: string;
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const { from, to, subject, html } = payload;
    const mailOptions = {
      from: from ? `${from} <${from}>` : `DOST ASTI SRA <${from}>`,
      to,
      subject,
      html,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};
