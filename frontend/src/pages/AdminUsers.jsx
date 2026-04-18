import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Mail, Shield, User as UserIcon, Calendar, Search, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import API_BASE_URL from '../config';

const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}/${url.replace(/^\//, '')}`;
};

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [user?.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this user from the platform?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
          setUsers(users.filter(u => u._id !== id));
          if (selectedUser?._id === id) setSelectedUser(null);
        } else {
          const err = await res.json();
          alert(err.message);
        }
      } catch (error) { console.error(error); }
    }
  };

  const handleVerifyKYC = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}/kyc`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, kycStatus: status } : u));
        if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, kycStatus: status }));
      } else {
        alert('Failed to update KYC status');
      }
    } catch (error) { console.error(error); }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingKycCount = users.filter(u => u.kycStatus === 'pending').length;

  return (
    <AdminLayout>
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 dark:text-white">Identity Governance</h1>
          <p className="text-slate-500 font-medium">Manage UNITED CAR users, KYC approvals, and system roles.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Users', value: users.length, icon: <Users className="text-blue-600" /> },
          { label: 'KYC Pending', value: pendingKycCount, icon: <Shield className="text-orange-500" /> },
          { label: 'Verified Users', value: users.filter(u => u.kycStatus === 'verified').length, icon: <Calendar className="text-green-500" /> }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl bg-white dark:bg-slate-900 border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black dark:text-white">{stat.value}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-left">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">KYC Status</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6 h-16 bg-slate-50/50 dark:bg-white/5"></td>
                  </tr>
                ))
              ) : filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold dark:text-white">{u.name}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] w-fit font-bold uppercase ${u.kycStatus === 'verified' ? 'bg-green-100 text-green-600' : u.kycStatus === 'pending' ? 'bg-orange-100 text-orange-600' : u.kycStatus === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.kycStatus || 'unsubmitted'}
                      </span>
                      {u.documents?.submittedAt && (
                        <div className="text-xs text-slate-400">Submitted: {new Date(u.documents.submittedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.kycStatus === 'pending' && (
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> View Docs
                        </button>
                      )}
                      {u.kycStatus === 'pending' && (
                        <>
                          <button onClick={() => handleVerifyKYC(u._id, 'verified')} className="p-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-bold">Approve</button>
                          <button onClick={() => handleVerifyKYC(u._id, 'rejected')} className="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold">Reject</button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(u._id)}
                        disabled={u.role === 'admin'}
                        className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black dark:text-white">KYC Documents</h3>
                  <p className="text-sm text-slate-500">{selectedUser.name} — {selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Government ID / Aadhar</p>
                  {selectedUser.documents?.idProofUrl ? (
                    <a href={resolveUrl(selectedUser.documents.idProofUrl)} target="_blank" rel="noreferrer">
                      <img src={resolveUrl(selectedUser.documents.idProofUrl)} alt="ID Proof" className="w-full h-48 object-cover rounded-2xl border border-slate-200 hover:opacity-90 transition-opacity" />
                    </a>
                  ) : (
                    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">No document uploaded</div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Driving License</p>
                  {selectedUser.documents?.licenseUrl ? (
                    <a href={resolveUrl(selectedUser.documents.licenseUrl)} target="_blank" rel="noreferrer">
                      <img src={resolveUrl(selectedUser.documents.licenseUrl)} alt="Driving License" className="w-full h-48 object-cover rounded-2xl border border-slate-200 hover:opacity-90 transition-opacity" />
                    </a>
                  ) : (
                    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">No document uploaded</div>
                  )}
                </div>
              </div>

              {selectedUser.kycStatus === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVerifyKYC(selectedUser._id, 'verified')}
                    className="flex-1 py-4 rounded-2xl bg-green-600 text-white font-black hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" /> Approve KYC
                  </button>
                  <button
                    onClick={() => handleVerifyKYC(selectedUser._id, 'rejected')}
                    className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-5 w-5" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsers;
