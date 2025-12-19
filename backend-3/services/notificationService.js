const { createQueue } = require("../config/bullmq");
const { Notification } = require("../models");

const emailQueue = createQueue("email-queue");

exports.sendEmail = async ({ to, subject, text, html, schoolId, userId }) => {
    // 1. Add job to queue
    await emailQueue.add("send-email", { to, subject, text, html });

    // 2. Log notification in DB
    if (userId && schoolId) {
        await Notification.create({
            schoolId, 
            userId,
            title: subject,
            message: text || "Email Sent",
            type: "EMAIL",
            status: "SENT"
        });
    }
};

exports.sendInAppNotification = async ({ schoolId, userId, title, message }) => {
    await Notification.create({
        schoolId, userId, title, message, type: "IN_APP", status: "SENT"
    });
    // Real-time socket emission logic would go here
};
