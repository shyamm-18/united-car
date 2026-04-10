import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminFleet from './pages/AdminFleet';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminFleetTracker from './pages/AdminFleetTracker';
import AdminConfig from './pages/AdminConfig';
import { useLocation } from 'react-router-dom';
import LuxeChatbot from './components/common/LuxeChatbot';
import SubscriptionPage from './pages/SubscriptionPage';
import React from 'react';
import { AlertCircle, Shield, Activity } from 'lucide-react';

// STABLE Error Boundary for Diagnostic Visibility
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
          <p className="text-slate-500 mb-8 max-w-md font-medium">An unexpected runtime failure occurred. Dashboard synchronization paused for safety.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
          >
            Reset Command Center
          </button>
          <div className="mt-12 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 text-left max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Diagnostics Console</div>
            <pre className="text-xs text-red-500 font-mono overflow-auto max-h-40 custom-scrollbar">
              {this.state.error?.toString()}
            </pre>
          </div>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unlimited" element={<SubscriptionPage />} />
            
            {/* Admin Strategic Access Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/fleet" element={<AdminRoute><AdminFleet /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/tracking" element={<AdminRoute><AdminFleetTracker /></AdminRoute>} />
            <Route path="/admin/config" element={<AdminRoute><AdminConfig /></AdminRoute>} />
            
            {/* Catch-all Redirect */}
            <Route path="/cars" element={<Navigate to="/#fleet" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
      <AppContent />
    </Router>
  );
}

export default App;
