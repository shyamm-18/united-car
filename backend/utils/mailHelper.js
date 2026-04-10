const nodemailer = require('nodemailer');

// Use Ethereal for professional development mock if no SMTP provided
// In production, replace with real SMTP (SendGrid, Gmail, etc.)
const createTransporter = async () => {
    // For Demo: Use a test account
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"UNITED CAR Concierge" <unitedcarsjhotwara@gmail.comm>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error("Email sending failed", error);
    }
};

const templates = {
    bookingConfirmation: (userName, carModel, startDate) => `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
            <h1 style="color: #1e293b; text-align: center; font-weight: 900; letter-spacing: -1px;">UNITED CAR</h1>
            <div style="background-color: #3b82f6; height: 4px; border-radius: 2px; margin-bottom: 40px;"></div>
            <p style="font-size: 18px; color: #475569;">Hello <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.6;">
                Your reservation for the <strong>${carModel}</strong> is officially confirmed. 
                Our team is currently preparing the vehicle to ensure it meets our elite standards.
            </p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Pickup Date</p>
                <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 20px; font-weight: bold;">${new Date(startDate).toLocaleDateString()}</p>
            </div>
            <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 40px;">
                Thank you for choosing UNITED CAR. The journey of a lifetime begins now.
            </p>
        </div>
    `,
    tripReminder: (userName, carModel) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
            <h2 style="color: #1a1a1a;">Gear Up, ${userName}!</h2>
            <p>This is a friendly reminder that your premium rental of the <strong>${carModel}</strong> starts tomorrow.</p>
            <p>Your vehicle will be sanitized and waiting at the selected pickup point.</p>
            <p style="margin-top: 30px;">See you soon,<br>The UNITED CAR Team</p>
        </div>
    `
};

module.exports = { sendEmail, templates };
