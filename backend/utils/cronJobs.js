const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendEmail, templates } = require('./mailHelper');
const { sendSMS, smsTemplates } = require('./smsHelper');

const initCronJobs = () => {
    // Run every day at 00:00 (Midnight)
    // For demo/testing, could use '*/1 * * * *' (every minute)
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily trip reminder scan...');
        
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

            // Find bookings starting tomorrow
            const upcomingBookings = await Booking.find({
                startDate: {
                    $gte: tomorrow,
                    $lt: dayAfterTomorrow
                },
                status: 'confirmed'
            }).populate('user').populate('car');

            console.log(`Found ${upcomingBookings.length} upcoming trips for tomorrow.`);

            for (const booking of upcomingBookings) {
                const user = booking.user;
                const car = booking.car;

                // 1. Send Email Reminder
                if (user.notificationSettings?.email) {
                    await sendEmail(
                        user.email,
                        `Reminder: Your ${car.brand} ${car.model} awaits!`,
                        templates.tripReminder(user.name, `${car.brand} ${car.model}`)
                    );
                }

                // 2. Send SMS Reminder
                if (user.notificationSettings?.sms && user.phone) {
                    await sendSMS(
                        user.phone,
                        smsTemplates.tripReminder(`${car.brand} ${car.model}`)
                    );
                }
            }
        } catch (error) {
            console.error('Trip reminder cron failed', error);
        }
    });
};

module.exports = { initCronJobs };
