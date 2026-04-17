const Inquiry = require('../models/Inquiry');
const { sendEmail, templates } = require('../utils/mailHelper');

// @desc    Send contact inquiry
// @route   POST /api/contact
// @access  Public
const sendInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // 1. Save to Database
    const inquiry = await Inquiry.create({
      name: fullName,
      email,
      message
    });

    // 2. Send Email to Admin
    const adminEmail = 'arebhai09@gmail.com';
    const emailSubject = `New Inquiry from ${fullName}`;
    const emailHtml = templates.adminInquiryNotification(fullName, email, message);

    await sendEmail(adminEmail, emailSubject, emailHtml);

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: inquiry
    });

  } catch (error) {
    console.error('Contact Inquiry Error:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

module.exports = {
  sendInquiry
};
