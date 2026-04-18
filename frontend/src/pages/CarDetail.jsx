import { useState, useEffect, useContext, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Settings, Filter, ArrowLeft, CheckCircle, Shield, MapPin, X, CreditCard, Loader2, Calendar, Check } from 'lucide-react';
import { MOCK_CARS } from '../data/cars';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';
import { ReviewList, ReviewForm } from '../components/cars/ReviewSystem';
import { useTranslation } from 'react-i18next';
import CarGallery from '../components/cars/CarGallery';
import AddonSelector from '../components/cars/AddonSelector';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Select Pickup Location');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  
  // Total Days & Price Calculation
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [surgeApplied, setSurgeApplied] = useState(false);
  
  // Airbnb Calendar States
  const [bookedDates, setBookedDates] = useState([]);
  const [isOverlapping, setIsOverlapping] = useState(false);

  // DEFINED AT TOP SCOPE TO PREVENT ReferenceError
  const fetchCar = useCallback(async () => {
    console.log("Detecting Car ID Profile:", id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cars/${id}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Server Handshake Successful. Received Car:", data.model);
        setCar(data);
        
        // Fetch Booked Dates for this vehicle
        try {
          const bRes = await fetch(`${API_BASE_URL}/api/bookings/car/${data._id}`);
          if (bRes.ok) {
            const bData = await bRes.json();
            setBookedDates(bData);
          }
        } catch (e) { console.error('Failed to fetch booked dates'); }
        
      } else {
        console.warn("Server Handshake Failed. Initializing MOCK fallback protocols...");
        const fallback = MOCK_CARS.find(c => c._id === id) || 
                        MOCK_CARS.find(c => c.id === id) || 
                        MOCK_CARS[0];
        setCar(fallback);
      }
    } catch (error) {
      console.error("Network Interruption. Reverting to Mock Datasets:", error);
      const fallback = MOCK_CARS.find(c => c._id === id) || MOCK_CARS[0];
      setCar(fallback);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id) 
        : [...prev, addon]
    );
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = diffDays > 0 ? diffDays : 0;
      setTotalDays(days);
      
      if (car) {
        let calculatedBasePrice = 0;
        let hasSurge = false;
        
        // Surge Pricing Algorithm: +20% for Saturday/Sunday
        for (let i = 0; i < days; i++) {
          const currentDate = new Date(start.getTime() + (i * 24 * 60 * 60 * 1000));
          const dayOfWeek = currentDate.getDay();
          
          if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
             calculatedBasePrice += (car.pricePerDay || car.price) * 1.2;
             hasSurge = true;
          } else {
             calculatedBasePrice += (car.pricePerDay || car.price);
          }
        }
        
        setSurgeApplied(hasSurge);

        let addonsPrice = selectedAddons.reduce((acc, addon) => {
          return acc + (addon.type === 'per_day' ? addon.price * days : addon.price);
        }, 0);
        
        setTotalPrice(Math.round(calculatedBasePrice + addonsPrice));
        
        // Airbnb Validation Logic
        let overlap = false;
        bookedDates.forEach(b => {
           const bX = new Date(b.startDate).getTime();
           const bY = new Date(b.endDate).getTime();
           if (start.getTime() < bY && end.getTime() > bX) {
              overlap = true;
           }
        });
        setIsOverlapping(overlap);
      }
    } else {
       setIsOverlapping(false);
    }
  }, [startDate, endDate, car, selectedAddons, bookedDates]);

  const handleContinue = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isMonthly) {
       setPaymentMethod('monthly');
       setIsModalOpen(true);
       return;
    }
    if (totalDays <= 0 || pickupLocation === 'Select Pickup Location') {
      alert('Please select valid dates and location');
      return;
    }
    setIsModalOpen(true);
  };
  
  const [paymentMethod, setPaymentMethod] = useState(null); // 'pickup' or 'card'

  const handlePayment = async (method) => {
    setIsProcessing(true);
    
    const bookingData = {
      carId: car?._id,
      startDate,
      endDate,
      totalPrice,
      pickupLocation,
      addons: selectedAddons,
      paymentMethod: method
    };

    try {
      const res = await fetch(isMonthly ? `${API_BASE_URL}/api/subscriptions` : `${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(isMonthly ? { carId: car?._id, price: car?.monthlyPrice || 45000 } : bookingData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setTimeout(() => {
           setIsProcessing(false);
           setIsModalOpen(false);
           navigate('/success', { state: { car, bookingData } });
        }, 5000);
      } else {
        setIsProcessing(false);
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
       setIsProcessing(false);
       alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="w-full h-[50vh] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center p-8">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold dark:text-white">Vehicle Intelligence Missing</h2>
        <p className="text-slate-500 mb-8 max-w-md">The requested unit is not responding. It may have been rotated out of the active premium selection.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold transition-transform hover:scale-105">
           Return to Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-inter">
      <Helmet>
        <title>{`${car.brand} ${car.model} | Rent Luxury Car in Jaipur & India`}</title>
        <meta name="description" content={`Rent a ${car.brand} ${car.model} in Jaipur or anywhere in India. ${car.description?.substring(0, 150)}... Book your elite ride with UNITED CAR.`} />
        <meta name="keywords" content={`${car.brand} ${car.model} rental, rent ${car.model} jaipur, luxury car hire india, ${car.brand} car rental rajasthan`} />
        
        {/* Open Graph Tags for Social Sharing */}
        <meta property="og:title" content={`${car.brand} ${car.model} | UNITED CAR Luxury Rental`} />
        <meta property="og:description" content={`Drive excellence. Rent the ${car.brand} ${car.model} starting from ₹${car.pricePerDay} per day.`} />
        <meta property="og:image" content={car.image} />
      </Helmet>

      {/* Modern High-Impact Header */}
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <CarGallery car={car} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="w-full">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black dark:text-white mb-4 tracking-tighter">{car?.brand} {car?.model}</h1>
              <div className="flex items-center text-slate-500 gap-6 flex-wrap">
                <span className="bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-600/20">{car?.type}</span>
                <div className="flex items-center text-yellow-500 font-black text-lg">
                  <Star className="h-6 w-6 fill-current mr-2" /> {car?.averageRating || car?.rating || 4.5}
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">Specifications</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <Users/>, label: 'Seats', value: `${car?.seats || 5} Adults` },
                  { icon: <Settings/>, label: 'Transmission', value: car?.transmission || 'Automatic' },
                  { icon: <Filter/>, label: 'Fuel Type', value: car?.fuel || 'Diesel/Petrol' },
                  { icon: <Shield/>, label: 'Security', value: 'High' }
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                    <div className="text-blue-500 mb-2">{spec.icon}</div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{spec.label}</span>
                    <span className="font-semibold text-sm dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
               <h3 className="text-xl font-bold mb-4 dark:text-white">Overview</h3>
               <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                 Experience the pinnacle of automotive engineering with the {car?.brand} {car?.model}. 
                 A perfect blend of luxury and performance, designed for those who refuse to compromise. 
                 UNITED CAR offers this vehicle as part of our exclusive elite selection.
               </p>
            </div>

            <AddonSelector selectedAddons={selectedAddons} onToggle={handleAddonToggle} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 glass rounded-[2.5rem] p-8 border border-white/40 dark:border-slate-800/40 shadow-2xl bg-white/70 dark:bg-slate-900/70">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
                 <button onClick={() => setIsMonthly(false)} className={`flex-grow py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${!isMonthly ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white' : 'text-slate-500'}`}> DAILY </button>
                 <button onClick={() => setIsMonthly(true)} className={`flex-grow py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${isMonthly ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}> MONTHLY </button>
              </div>

              <div className="mb-8 relative">
                  <span className="text-4xl font-black dark:text-white">₹{(isMonthly ? (car?.monthlyPrice || 45000) : (totalPrice || car?.pricePerDay || car?.price))?.toLocaleString()}</span>
                  <span className="text-slate-500 font-medium ml-2">/ {isMonthly ? 'month' : (totalDays > 0 ? 'total' : 'day')}</span>
                  {surgeApplied && !isMonthly && (
                    <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg shadow-red-500/40 animate-pulse">
                      High Demand Surge
                    </div>
                  )}
              </div>

              {!isMonthly && (
                <div className="space-y-4 mb-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <MapPin className="h-3 w-3 text-blue-500" /> Pickup Location
                     </label>
                     <select 
                       value={pickupLocation} 
                       onChange={(e) => setPickupLocation(e.target.value)}
                       className="w-full px-4 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold dark:text-white appearance-none"
                     >
                       <option disabled value="Select Pickup Location">Select Location</option>
                       <option value="Jaipur - City Center">Jaipur - City Center</option>
                       <option value="Jaipur - International Airport">Jaipur - International Airport</option>
                       <option value="Jodhpur - Blue City Hub">Jodhpur - Blue City Hub</option>
                       <option value="Bikaner - Jn. Station">Bikaner - Jn. Station</option>
                       <option value="Sikar - Premium Lounge">Sikar - Premium Lounge</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Calendar className="h-3 w-3" /> Start Date
                     </label>
                     <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold dark:text-white" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Calendar className="h-3 w-3 text-blue-500" /> End Date
                     </label>
                     <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold dark:text-white" />
                   </div>
                </div>
              )}

              {isOverlapping && (
                 <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl flex items-center justify-center gap-2">
                    <X className="h-4 w-4" /> This vehicle is already booked during these dates.
                 </div>
              )}

              <button 
                onClick={() => {
                   if (user && user.kycStatus !== 'verified') {
                      alert('Please complete your KYC Verification in your Profile before booking.');
                      navigate('/profile');
                      return;
                   }
                   handleContinue();
                }} 
                disabled={isOverlapping}
                className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-xl shadow-blue-500/30 transition-all"
              >
                {user 
                   ? (isOverlapping 
                        ? 'Dates Unavailable' 
                        : (user.kycStatus !== 'verified' ? 'Verify KYC to Book' : (isMonthly ? 'Confirm Subscription' : 'Continue to Payment'))) 
                   : 'Login Required'}
              </button>
            </div>
          </div>
        </div>

        <section className="mt-24 border-t border-slate-200/50 dark:border-slate-800/50 pt-24">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                 <h3 className="text-3xl font-black mb-12 flex items-center gap-4 dark:text-white">
                    Feedback Network <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">{car?.numReviews || 0}</span>
                 </h3>
                 <ReviewList carId={car?._id} />
              </div>
              <div className="lg:col-span-1">
                 <ReviewForm carId={car?._id} onReviewAdded={fetchCar} />
              </div>
           </div>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 max-w-lg w-full">
                 {!paymentMethod ? (
                   <>
                     <h2 className="text-2xl font-black mb-6 dark:text-white">Secure Checkout</h2>
                     <div className="space-y-4 mb-8">
                        <button 
                          onClick={() => setPaymentMethod('pickup')}
                          className="w-full p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all text-left flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold dark:text-white">Pay at Pickup</div>
                            <div className="text-xs text-slate-500">Fast concierge delivery</div>
                          </div>
                          <Check className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100" />
                        </button>

                        <button 
                          onClick={() => setPaymentMethod('card')}
                          className="w-full p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all text-left flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold dark:text-white">Credit / Debit Card</div>
                            <div className="text-xs text-slate-500">Secure digital encryption</div>
                          </div>
                          <CreditCard className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100" />
                        </button>
                     </div>
                   </>
                 ) : (
                   <div className="text-center">
                     <h2 className="text-2xl font-black mb-4 dark:text-white">Confirm Booking</h2>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8 text-left">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-500 text-xs">Vehicle</span>
                          <span className="font-bold dark:text-white">{car?.brand} {car?.model}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-500 text-xs">Location</span>
                          <span className="font-bold dark:text-white">{pickupLocation}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <span className="font-black dark:text-white">Total Amount</span>
                          <span className="font-black text-blue-600">₹{totalPrice.toLocaleString()}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => handlePayment(paymentMethod)} 
                        disabled={isProcessing}
                        className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex flex-col items-center justify-center gap-1 disabled:opacity-70"
                     >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin" />
                            <span className="text-[10px] uppercase tracking-widest opacity-80">Securing your reservation...</span>
                          </>
                        ) : 'Finish & Book Now'}
                     </button>
                     <button onClick={() => setPaymentMethod(null)} className="mt-4 text-xs font-bold text-slate-400">Changed my mind (Back)</button>
                   </div>
                 )}
                 <button onClick={() => { setIsModalOpen(false); setPaymentMethod(null); }} className="absolute h-10 w-10 top-6 right-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors">
                   <X className="h-5 w-5" />
                 </button>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetail;
