import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_NAME,
        pass: process.env.SMTP_PASS
    }
});


export default transporter;