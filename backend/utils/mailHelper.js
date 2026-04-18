const nodemailer = require('nodemailer');

// Use Ethereal for professional development mock if no SMTP provided
// In production, replace with real SMTP (SendGrid, Gmail, etc.)
// Use Ethereal for professional development mock if no SMTP provided
// In production, replace with real SMTP (SendGrid, Gmail, etc.)
const createTransporter = async () => {
    // If real credentials available, use them
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // For Demo: Use a test account (Ethereal)
    try {
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
    } catch (err) {
        console.error("Ethereal account creation failed, returning mock transporter", err);
        return {
            sendMail: async (opts) => {
                console.log("MOCK EMAIL (No SMTP configured):", opts);
                return { messageId: 'mock-id' };
            }
        };
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: `"UNITED CAR Concierge" <${process.env.EMAIL_USER || 'arebhai09@gmail.com'}>`,
            to,
            subject,
            html,
        });

        if (info.messageId !== 'mock-id' && !process.env.EMAIL_USER) {
            console.log("Message sent (Ethereal): %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } else {
            console.log("Email sent successfully");
        }
        return info;
    } catch (error) {
        console.error("Email sending failed", error);
    }
};

const templates = {
    passwordReset: (userName, resetUrl) => `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
            <h1 style="color: #1e293b; text-align: center; font-weight: 900; letter-spacing: -1px;">UNITED CAR</h1>
            <div style="background-color: #ef4444; height: 4px; border-radius: 2px; margin-bottom: 40px;"></div>
            <p style="font-size: 18px; color: #475569;">Hello <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.6;">
                We received a request to reset the password for your UNITED CAR account. 
                Click the button below to proceed.
            </p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="background-color: #1e293b; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">Reset My Password</a>
            </div>
            <p style="font-size: 14px; color: #94a3b8; text-align: center;">
                If you did not request this, please ignore this email. This link will expire in 1 hour.
            </p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 40px;">
            <p style="font-size: 12px; color: #cbd5e1; text-align: center;">
                United Car Logistics Ltd. | Luxury Verified
            </p>
        </div>
    `,
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
    `,
    adminInquiryNotification: (name, email, message) => `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">UNITED CAR</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px; text-transform: uppercase; tracking-widest: 1px;">New Business Inquiry</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; border: 1px solid #f1f5f9;">
                <div style="margin-bottom: 25px;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">From</p>
                    <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 18px; font-weight: bold;">${name}</p>
                    <p style="margin: 2px 0 0 0; color: #3b82f6; font-size: 14px;">${email}</p>
                </div>
                
                <div style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">Message Content</p>
                    <p style="margin: 10px 0 0 0; color: #334155; font-size: 16px; line-height: 1.6; font-style: italic;">
                        "${message}"
                    </p>
                </div>
            </div>
            
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px;">
                This inquiry was sent from the official UNITED CAR contact portal.
            </p>
        </div>
    `
};

module.exports = { sendEmail, templates };
