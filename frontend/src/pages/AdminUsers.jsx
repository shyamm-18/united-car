import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Mail, Shield, User as UserIcon, Calendar, Search } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import API_BASE_URL from '../config';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    fetchUsers();
  }, [user?.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this user from the platform?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
           setUsers(users.filter(u => u._id !== id));
        } else {
           const err = await res.json();
           alert(err.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black mb-2 dark:text-white">Identity Governance</h1>
           <p className="text-slate-500 font-medium">Manage UNITED CAR users and system roles.</p>
        </div>
        <div className="relative max-w-sm w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by name or email..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
           />
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {[
           { label: 'Total Users', value: users.length, icon: <Users className="text-blue-600" /> },
           { label: 'Active Today', value: Math.floor(users.length * 0.7), icon: <Shield className="text-green-500" /> },
           { label: 'New This Week', value: 2, icon: <Calendar className="text-purple-500" /> }
         ].map((stat, i) => (
           <div key={i} className="glass p-6 rounded-3xl bg-white dark:bg-slate-900 border border-white/20 flex items-center justify-between">
              <div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                 <div className="text-3xl font-black dark:text-white">{stat.value}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                 {stat.icon}
              </div>
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
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
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
                     {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                     <button 
                       onClick={() => handleDelete(u._id)}
                       disabled={u.role === 'admin'}
                       className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-50"
                     >
                        <Trash2 className="h-4 w-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
