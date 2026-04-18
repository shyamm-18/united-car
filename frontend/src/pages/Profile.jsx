import { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Loader2, Camera, Upload, FileImage, Clock, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../config';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isKycRoute = location.pathname === '/profile/kyc';
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // KYC State
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'unsubmitted');
  const [kycMessage, setKycMessage] = useState(null);
  const [kycError, setKycError] = useState(null);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  // File upload state
  const [idFile, setIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const idRef = useRef();
  const licenseRef = useRef();

  // Scroll to KYC if hash is #kyc
  useEffect(() => {
    if (window.location.hash === '#kyc' || isKycRoute) {
      setTimeout(() => {
        document.getElementById('kyc-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [isKycRoute]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'id') { setIdFile(file); setIdPreview(url); }
    else { setLicenseFile(file); setLicensePreview(url); }
  };

  // Helper for faster uploads via compression
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200; // Optimal for verified preview
          if (width > height) {
            if (width > maxDim) { height *= maxDim / width; width = maxDim; }
          } else {
            if (height > maxDim) { width *= maxDim / height; height = maxDim; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7);
        };
      };
    });
  };

  const uploadFile = async (file, fieldName) => {
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append('image', compressed, 'upload.jpg');
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsUpdating(true);
    const result = await updateProfile({ name, email, password });
    setIsUpdating(false);
    if (result.success) {
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setKycMessage(null);
    setKycError(null);

    if (!idFile || !licenseFile) {
      setKycError('Please upload both Government ID and Driving License photos.');
      return;
    }

    setIsSubmittingKyc(true);
    try {
      const [idUrl, licenseUrl] = await Promise.all([
        uploadFile(idFile, 'idProof'),
        uploadFile(licenseFile, 'license')
      ]);

      const res = await fetch(`${API_BASE_URL}/api/auth/profile/kyc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ idProofUrl: idUrl, licenseUrl })
      });
      const data = await res.json();
      if (res.ok) {
        setKycStatus(data.kycStatus);
        setKycMessage('Documents submitted! Admin will verify within 1 hour.');
      } else {
        setKycError(data.message || 'Failed to submit KYC');
      }
    } catch (err) {
      setKycError('Upload failed. Please try again.');
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  const FileUploadBox = ({ preview, inputRef, onChange, label, icon, isUploading }) => (
    <div
      className={`relative border-2 border-dashed ${isUploading ? 'border-blue-500 bg-blue-50/10' : 'border-slate-300 dark:border-slate-600'} rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all group`}
      onClick={() => !isUploading && inputRef.current?.click()}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-full h-44 object-cover" />
          {isUploading && (
            <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-bold text-sm">Change Photo</p>
          </div>
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center gap-3 p-6 text-slate-400">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          ) : (
            <>
              {icon}
              <p className="font-bold text-sm text-center">{label}</p>
              <p className="text-xs text-center uppercase tracking-tighter opacity-60">Wait, Only JPG/PNG</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </button>
          <h1 className="text-4xl font-black mb-2 dark:text-white">
            {isKycRoute ? 'Identity Verification' : 'Account Settings'}
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">
            {isKycRoute 
              ? 'Complete your KYC to unlock premium vehicle bookings.' 
              : 'Manage your personal identity and advanced security settings.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600/20">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&size=256`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold dark:text-white">{user?.name}</h3>
              <p className="text-slate-500 text-sm font-medium">{user?.role?.toUpperCase()}</p>
            </div>

            <div className="glass p-6 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <div className="flex items-center gap-3 mb-2 font-bold uppercase text-xs tracking-widest">
                <Shield className="h-4 w-4" /> Account Security
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80">
                Your profile is protected by enterprise-grade encryption and JWT authentication.
              </p>
            </div>

            <div className={`glass p-6 rounded-[2.5rem] border ${kycStatus === 'verified' ? 'bg-green-600/5 border-green-600/20 text-green-600' : kycStatus === 'rejected' ? 'bg-red-600/5 border-red-600/20 text-red-600' : kycStatus === 'pending' ? 'bg-yellow-600/5 border-yellow-600/20 text-yellow-600' : 'bg-orange-600/5 border-orange-600/20 text-orange-600'}`}>
              <div className="flex items-center gap-3 mb-2 font-bold uppercase text-xs tracking-widest">
                <AlertCircle className="h-4 w-4" /> KYC Status
              </div>
              <p className="text-xl font-black capitalize tracking-tight">
                {kycStatus === 'unsubmitted' ? 'Not Verified' : kycStatus}
              </p>
              {kycStatus === 'pending' && (
                <p className="text-xs font-medium mt-2 opacity-80 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Admin review within 1 hour
                </p>
              )}
              <p className="text-xs font-medium mt-1 opacity-80">
                {kycStatus === 'verified' ? 'You have full access to rent luxury vehicles.' : 'Complete verification to unlock vehicle bookings.'}
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              {message && (
                <div className="mb-8 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 text-green-600 flex items-center gap-3 font-bold">
                  <CheckCircle className="h-5 w-5" /> {message}
                </div>
              )}
              {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 text-red-600 flex items-center gap-3 font-bold">
                  <AlertCircle className="h-5 w-5" /> {error}
                </div>
              )}

              {!isKycRoute ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <section className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-2">Display Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <hr className="border-slate-100 dark:border-slate-800" />
                  
                  <section className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Update Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-2">New Password (Optional)</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-2">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <button type="submit" disabled={isUpdating} className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                    {isUpdating ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                  </button>
                </form>
              ) : (
                /* KYC Section */
                <div id="kyc-section" className="space-y-6 scroll-mt-8">
                  <div>
                    <h4 className="flex items-center gap-3 text-2xl font-black dark:text-white mb-2 tracking-tighter">
                      <Shield className="text-blue-500 h-8 w-8" /> Verify Your Identity
                    </h4>
                    <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      UNITED CAR requires a valid Government ID and Driving License to authorize vehicle rentals. Verification is completed within <strong>1 hour</strong>.
                    </p>
                  </div>

                  {kycMessage && (
                    <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center gap-3 font-bold text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0" /> {kycMessage}
                    </div>
                  )}
                  {kycError && (
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center gap-3 font-bold text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {kycError}
                    </div>
                  )}

                  {kycStatus === 'verified' ? (
                    <div className="p-8 rounded-[2.5rem] bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 flex items-center gap-6">
                      <CheckCircle className="h-12 w-12 shrink-0" />
                      <div>
                        <p className="font-black text-2xl tracking-tight">Identity Verified</p>
                        <p className="text-sm opacity-80 mt-1 font-medium">Your documents have been approved. You have unlimited access to the elite fleet.</p>
                      </div>
                    </div>
                  ) : kycStatus === 'pending' ? (
                    <div className="p-8 rounded-[2.5rem] bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 text-yellow-700 flex items-center gap-6">
                      <Clock className="h-12 w-12 shrink-0 animate-pulse" />
                      <div>
                        <p className="font-black text-2xl tracking-tight">Under Review</p>
                        <p className="text-sm opacity-80 mt-1 font-medium">Verification in progress. Expect response within 1 hour.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleKycSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2 text-slate-400">
                            <FileImage className="h-4 w-4" /> Aadhar Card / ID Photo
                          </label>
                          <FileUploadBox
                            preview={idPreview}
                            inputRef={idRef}
                            onChange={e => handleFileChange(e, 'id')}
                            label="Upload Aadhar Card"
                            icon={<Upload className="h-10 w-10 text-blue-500" />}
                            isUploading={isSubmittingKyc}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2 text-slate-400">
                            <FileImage className="h-4 w-4" /> Driving License Photo
                          </label>
                          <FileUploadBox
                            preview={licensePreview}
                            inputRef={licenseRef}
                            onChange={e => handleFileChange(e, 'license')}
                            label="Upload Driving License"
                            icon={<Upload className="h-10 w-10 text-green-500" />}
                            isUploading={isSubmittingKyc}
                          />
                        </div>
                      </div>

                      <button type="submit" disabled={isSubmittingKyc} className="w-full py-5 rounded-[2rem] bg-slate-900 dark:bg-blue-600 text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                        {isSubmittingKyc ? (
                          <><Loader2 className="animate-spin h-6 w-6" /> Compressing & Uploading...</>
                        ) : (
                          <><Shield className="h-6 w-6" /> Submit KYC Documents</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
