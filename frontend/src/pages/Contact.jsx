import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  // Handle User Data Auto-Fill
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || nameParts[0] || '',
        lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Handle Service Request Auto-Fill
  useEffect(() => {
    const serviceName = searchParams.get('service');
    if (serviceName) {
      setFormData(prev => ({
        ...prev,
        message: `I am interested in requesting the "${serviceName}" premium service. Please provide me with more details regarding pricing, availability, and the booking process.`
      }));
      
      // Smooth scroll to form
      setTimeout(() => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        // Clear form after success logic if needed
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact Submit Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
      {/* Background Aesthetic */}
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950">
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 dark:text-white">Get in Touch</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our luxury concierge team is available 24/7 to assist with your bespoke rental requirements and answer any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass p-8 rounded-3xl relative overflow-hidden bg-white/60 dark:bg-slate-900/40">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 dark:text-white">Call Us</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Mon-Fri from 8am to 8pm.</p>
                  <a href="tel:9216497682" className="font-semibold text-lg hover:text-blue-600 transition-colors block break-all">9216497682</a>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl relative overflow-hidden bg-white/60 dark:bg-slate-900/40">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 dark:text-white">Email Us</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">We'll respond within 2 hours.</p>
                  <a href="mailto:arebhai09@gmail.com" className="font-semibold text-lg hover:text-blue-600 transition-colors block break-all">arebhai09@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl relative overflow-hidden bg-white/60 dark:bg-slate-900/40">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 dark:text-white">Visit HQ</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">By appointment only.</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=JAIPUR+RAJASTHAN+302020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-blue-600 transition-colors block break-words"
                  >
                    JAIPUR, RAJASTHAN 302020
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
            id="contact-form"
          >
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-3xl bg-white/80 dark:bg-slate-900/60 shadow-xl border border-green-200 dark:border-green-900/30 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                   <motion.div
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     className="text-green-600"
                   >
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                     </svg>
                   </motion.div>
                </div>
                <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Inquiry Received</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                  Your message has been sent successfully. Our concierge team will reach out to you within 2 hours.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <div className="glass p-8 md:p-12 rounded-3xl bg-white/80 dark:bg-slate-900/60 shadow-xl border border-white/50 dark:border-slate-700/50">
                <h2 className="text-2xl font-bold mb-8 dark:text-white">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        placeholder="James"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        placeholder="Bond"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      placeholder="james@mi6.co.uk"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea
                      rows="4"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                      placeholder="How can we assist with your rental?"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={status === 'sending'}
                      className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
                      <Send className="ml-2 h-5 w-5" />
                    </button>
                    {status === 'error' && (
                      <p className="mt-4 text-red-500 text-sm font-medium">❌ Something went wrong. Please try again.</p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
