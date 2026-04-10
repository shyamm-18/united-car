/**
 * SMS Helper Utility
 * For Demo: Logs SMS to console
 * Production: Integrate with Twilio / Vonage
 */

const sendSMS = async (to, message) => {
    try {
        if (!to) return null;
        
        console.log("------------------------------------------");
        console.log(`[SMS SENT TO ${to}]`);
        console.log(`Message: ${message}`);
        console.log("------------------------------------------");
        
        return { success: true, sid: 'SM' + Math.random().toString(36).substr(2, 9) };
    } catch (error) {
        console.error("SMS delivery failed", error);
    }
};

const smsTemplates = {
    bookingConfirmation: (carModel) => `UNITED CAR: Your booking for the ${carModel} is confirmed! Get ready for an elite experience.`,
    tripReminder: (carModel) => `UNITED CAR Reminder: Your ${carModel} will be ready for pickup tomorrow! See you soon.`
};

module.exports = { sendSMS, smsTemplates };
