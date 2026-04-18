import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import LuxeChatbot from './components/common/LuxeChatbot';
import SkeletonLoader from './components/common/SkeletonLoader';
import React from 'react';
import { AlertCircle, Shield, Activity } from 'lucide-react';

// Lazy Loaded Pages for Blitz Speed
const Home = lazy(() => import('./pages/Home'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const RentalRequirements = lazy(() => import('./pages/RentalRequirements'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminFleet = lazy(() => import('./pages/AdminFleet'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminFleetTracker = lazy(() => import('./pages/AdminFleetTracker'));
const AdminConfig = lazy(() => import('./pages/AdminConfig'));
const AdminMap = lazy(() => import('./pages/AdminMap'));
import AdminRoute from './components/auth/AdminRoute';

// STABLE Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("CRITICAL UI ERROR:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 mb-6 font-bold text-2xl">!</div>
          <h2 className="text-3xl font-black mb-4 dark:text-white uppercase tracking-tighter">System Interruption</h2>
          <button onClick={() => window.location.href = '/'} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 transition-all">Reset Command Center</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-inter bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {!isAdminPath && <Navbar />}
      <main className={`flex-grow ${!isAdminPath ? 'pt-20' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<SkeletonLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars/:id" element={<CarDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/success" element={<BookingSuccess />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/requirements" element={<RentalRequirements />} />
              <Route path="/unlimited" element={<SubscriptionPage />} />
              
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/fleet" element={<AdminRoute><AdminFleet /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/tracking" element={<AdminRoute><AdminFleetTracker /></AdminRoute>} />
              <Route path="/admin/map" element={<AdminRoute><AdminMap /></AdminRoute>} />
              <Route path="/admin/config" element={<AdminRoute><AdminConfig /></AdminRoute>} />
              
              <Route path="/cars" element={<Navigate to="/#fleet" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <LuxeChatbot />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
