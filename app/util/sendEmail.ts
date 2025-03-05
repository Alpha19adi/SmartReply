import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const sendEmail = async (userEmail: string, verificationLink: string,username:string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
              user: process.env.BREVO_USER,
              pass: process.env.BREVO_API_KEY
            }
          });

        const mailOptions = {
            from: '"Smart Reply" <agrawaladitya543@gmail.com>',
            to: userEmail,
            subject: "Email Verification for Smart Reply",
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1>Hello ${username}</h1>
                    <h1>Verify Your Email Address</h1>
                    <p>Thank you for signing up! Please click the button below to verify your email address:</p>
                    <a href="${verificationLink}" 
                       style="display: inline-block; padding: 10px 20px; 
                              background-color: #007bff; color: white; 
                              text-decoration: none; border-radius: 5px; 
                              margin: 20px 0;">
                        Verify Email
                    </a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>${verificationLink}</p>
                    <p>This link will expire in 30 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;

    } catch (error) {
        console.error("Email sending error:", error);
        return false;
    }
};
