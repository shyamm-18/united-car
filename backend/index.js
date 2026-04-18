const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const contactRoutes = require('./routes/contactRoutes');
const compression = require('compression');
const { initCronJobs } = require('./utils/cronJobs');
const path = require('path');

dotenv.config();

connectDB();

// Initialize Background Tasks
initCronJobs();

const app = express();

// Speed Optimization: Gzip Compression
app.use(compression());

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// Static uploads folder with Cache Control (7 days)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  immutable: true
}));

// Serve Frontend Static Files with Cache Control
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath, {
  maxAge: '1d',
  etag: true
}));

// API Health Check (at a specific route instead of root)
app.get('/api/health', (req, res) => {
  res.send('API is running...');
});

// Catch-all middleware to serve Frontend index.html for SPA routing
app.use((req, res, next) => {
  // Only handle GET requests that are not API calls or static files
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
