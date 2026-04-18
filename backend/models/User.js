const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
    },
    kycStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
      default: 'unsubmitted'
    },
    documents: {
      idProofUrl: { type: String, default: null },
      licenseUrl: { type: String, default: null },
      submittedAt: { type: Date, default: null }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
