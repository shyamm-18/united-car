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
const frontendPath = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath, {
  maxAge: '1d',
  etag: true
}));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'up', environment: process.env.NODE_ENV, timestamp: new Date() });
});

// Home Route with Smart Redirect for Production Stability
app.get('/', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // Fallback to high-speed Vercel frontend if Render build hasn't finished
  console.log('Redirecting to Vercel fallback...');
  res.redirect('https://united-car.vercel.app');
});

// Catch-all middleware to serve Frontend index.html for SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    // Final safety: redirect deep links to Vercel home if build is missing
    return res.redirect('https://united-car.vercel.app' + req.path);
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
