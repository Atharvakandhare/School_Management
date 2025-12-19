const { createWorker } = require("../config/bullmq");
const nodemailer = require("nodemailer");

// Simple transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail", // Or use process.env.EMAIL_SERVICE
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const emailWorker = createWorker("email-queue", async (job) => {
    const { to, subject, text, html } = job.data;
    console.log(`Processing email for ${to}`);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
});

module.exports = emailWorker;
