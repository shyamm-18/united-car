const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    maxLength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
