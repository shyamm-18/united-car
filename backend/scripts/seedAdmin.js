const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    const adminData = {
      name: 'Shyam Sundar',
      email: 'shyamsundarbhukar27@gmail.com',
      password: '9216497682', // Will be hashed by userSchema.pre('save')
      role: 'admin',
      phone: '9216497682',
      notificationSettings: {
        email: true,
        sms: true
      }
    };

    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      console.log('Admin already exists. Updating credentials...');
      adminExists.password = adminData.password;
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin credentials updated successfully.');
    } else {
      await User.create(adminData);
      console.log('New Admin user created successfully.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
