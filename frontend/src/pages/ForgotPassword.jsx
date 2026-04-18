import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugUrl, setDebugUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Reset link has been sent to your email.');
        if (data.debugUrl) setDebugUrl(data.debugUrl);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-md w-full z-10 glass p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Forgot Password?</h2>
          <p className="text-slate-500 dark:text-slate-400">No worries, we'll send you reset instructions.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 flex flex-col items-center gap-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-sm font-bold">{message}</span>
            {debugUrl && (
              <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200/50 text-[10px] break-all">
                <p className="mb-1 uppercase tracking-widest font-black opacity-50">Testing Link:</p>
                <a href={debugUrl} className="text-blue-500 hover:underline">{debugUrl}</a>
              </div>
            )}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Back to Login</Link>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!message && (
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
