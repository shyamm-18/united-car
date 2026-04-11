import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, X, Loader2, Search, Filter, CheckCircle, Car as CarIcon, Gauge, Fuel, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

const AdminFleet = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    brand: '', model: '', type: 'SUV', pricePerDay: 0, image: '', seats: 5, transmission: 'Automatic', fuel: 'Petrol', isAvailable: true
  });

  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cars');
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormData({ brand: '', model: '', type: 'SUV', pricePerDay: 0, image: '', seats: 5, transmission: 'Automatic', fuel: 'Petrol', isAvailable: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setFormData(car);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await fetch(`http://localhost:5000/api/cars/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        fetchCars();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCar ? 'PUT' : 'POST';
    const url = editingCar 
      ? `http://localhost:5000/api/cars/${editingCar._id}` 
      : 'http://localhost:5000/api/cars';

    try {
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchCars();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 dark:text-white">Fleet Inventory</h1>
          <p className="text-slate-500 font-medium">Update, adjust, and expand your luxury assets.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          <Plus className="h-5 w-5" /> Add New Vehicle
        </button>
      </header>

      {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-80 glass animate-pulse rounded-[3rem]"></div>)}
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <motion.div 
              key={car._id}
              layout
              className="glass rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden group relative"
            >
              <div className="relative h-56">
                  <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={car.model} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleOpenEdit(car)} className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl text-slate-800 dark:text-white hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                        <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(car._id)} className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg">
                        <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                     <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {car.type}
                     </span>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${car.isAvailable ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {car.isAvailable ? 'Available' : 'Out of Service'}
                     </span>
                  </div>
              </div>
              <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-2xl font-black dark:text-white leading-none mb-1">{car.brand} {car.model}</h3>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{car.location?.address || 'Jaipur, Rajasthan'}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-xl font-black text-blue-600">₹{car.pricePerDay}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">per day</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                     <div className="flex flex-col items-center">
                        <CarIcon className="h-4 w-4 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold dark:text-slate-300 uppercase tracking-tighter">{car.transmission}</span>
                     </div>
                     <div className="flex flex-col items-center">
                        <Gauge className="h-4 w-4 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold dark:text-slate-300 uppercase tracking-tighter">{car.seats} Seats</span>
                     </div>
                     <div className="flex flex-col items-center">
                        <Fuel className="h-4 w-4 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold dark:text-slate-300 uppercase tracking-tighter">{car.fuel}</span>
                     </div>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
         {isModalOpen && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl glass p-10 rounded-[4rem] bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{editingCar ? 'Update Asset' : 'New Asset'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                      <X className="h-6 w-6 dark:text-white" />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Brand</label>
                         <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" placeholder="BMW" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Model</label>
                         <input required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" placeholder="X5" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Type</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white">
                             <option>SUV</option><option>Sedan</option><option>Luxury</option><option>Sports</option><option>Hatchback</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Daily Rate (₹)</label>
                         <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Vehicle Identity (Image)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="relative group/upload h-48 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500/50">
                            {formData.image ? (
                               <>
                                 <img src={formData.image} className="w-full h-full object-cover opacity-60 group-hover/upload:opacity-40 transition-opacity" alt="Preview" />
                                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <button 
                                      type="button" 
                                      onClick={() => document.getElementById('car-image-upload').click()}
                                      className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl scale-0 group-hover/upload:scale-100 transition-transform text-blue-600"
                                    >
                                       <Camera className="h-6 w-6" />
                                    </button>
                                 </div>
                               </>
                            ) : (
                               <button 
                                 type="button" 
                                 onClick={() => document.getElementById('car-image-upload').click()}
                                 className="flex flex-col items-center gap-3 text-slate-400 hover:text-blue-500 transition-colors"
                               >
                                  <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-sm">
                                     {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
                                  </div>
                                  <span className="text-xs font-bold uppercase tracking-widest">Select from Gallery</span>
                               </button>
                            )}
                            <input 
                              id="car-image-upload"
                              type="file" 
                              hidden 
                              accept="image/*"
                              onChange={handleFileUpload}
                            />
                         </div>
                         <div className="space-y-4">
                            <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10">
                               <div className="flex items-center gap-2 text-blue-600 mb-2">
                                  <ImageIcon className="h-4 w-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">URL Override</span>
                               </div>
                               <input 
                                 value={formData.image} 
                                 onChange={e => setFormData({...formData, image: e.target.value})} 
                                 className="w-full bg-transparent border-none outline-none font-bold text-xs dark:text-white placeholder:text-slate-400" 
                                 placeholder="Paste direct link (optional)" 
                               />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium px-2 leading-relaxed">
                               Upload high-resolution shots from your mobile gallery or laptop. Supported formats: JPG, PNG, WEBP.
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-6 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-inner">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Live Availability</div>
                           <div className="text-[11px] font-bold dark:text-slate-300 leading-tight">Visible for global customer bookings</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                          className={`w-14 h-8 rounded-full transition-all relative ${formData.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`}
                        >
                           <motion.div 
                             animate={{ x: formData.isAvailable ? 24 : 0 }}
                             initial={false}
                             className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm" 
                           />
                        </button>
                    </div>

                   <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Seats</label>
                         <input type="number" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 font-bold dark:text-white" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Drive</label>
                         <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full px-4 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 font-bold dark:text-white">
                             <option>Automatic</option><option>Manual</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Fuel</label>
                         <select value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} className="w-full px-4 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 font-bold dark:text-white">
                            <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                         </select>
                      </div>
                   </div>

                   <button type="submit" className="w-full py-6 rounded-[2.5rem] bg-blue-600 text-white font-black text-xl shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-tighter">
                      {editingCar ? 'Update Vehicle Data' : 'Initialize New Vehicle'}
                   </button>
                </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminFleet;

