import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, Info, Calendar, DollarSign } from 'lucide-react';

const LuxeChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to UNITED CAR! I'm your AI concierge. How can I help you today?", sender: 'ai', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cars, setCars] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cars');
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Chatbot failed to load fleet data", err);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateResponse = (input) => {
    const text = input.toLowerCase();
    
    // 1. Pricing Queries
    if (text.includes('price') || text.includes('cost') || text.includes('rent')) {
      const match = cars.find(c => text.includes(c.brand.toLowerCase()) || text.includes(c.model.toLowerCase()));
      if (match) {
        return `The ${match.brand} ${match.model} is available for ₹${match.pricePerDay} per day. Would you like me to take you to the detail page?`;
      }
      return "Our premium fleet starts from ₹50/day (Economy) up to ₹500/day for Luxury Sports. Which specific car are you interested in?";
    }

    // 2. Availability Queries
    if (text.includes('available') || text.includes('free') || text.includes('status')) {
      const match = cars.find(c => text.includes(c.brand.toLowerCase()) || text.includes(c.model.toLowerCase()));
      if (match) {
        return match.isAvailable 
          ? `Yes, the ${match.brand} ${match.model} is currently available for your next trip! 🚗`
          : `The ${match.brand} ${match.model} is currently on a journey, but we have similar models available.`;
      }
      return "Most of our elite fleet is available! You can check real-time status on our 'Fleet Map' on the homepage.";
    }

    // 3. Booking Help
    if (text.includes('book') || text.includes('reserve') || text.includes('how to')) {
      return "Booking is easy: \n1. Browse our fleet.\n2. Pick your favorite car.\n3. Choose your dates and location.\n4. Click 'Book Now' and complete the checkout!";
    }

    // 4. Greetings
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello! I'm here to assist you with your luxury car rental. What's on your mind?";
    }

    // Fallback
    return "That's a great question! For specific inquiries, you can call our 24/7 VIP support at +1 (555) LUXE-DRIVE, or ask me about pricing and availability of specific cars.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        text: generateResponse(inputText), 
        sender: 'ai', 
        time: new Date() 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 border border-white/20"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[100] w-[380px] h-[550px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-200 dark:border-white/10"
          >
            {/* Header */}
            <header className="p-6 bg-blue-600 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">LuxeAssistant</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold opacity-80">AI Concierge Online</span>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth hide-scrollbar bg-slate-50/50 dark:bg-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                      : 'bg-white dark:bg-slate-900 dark:border dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl rounded-tl-none flex gap-1 items-center shadow-sm">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Tags */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto hide-scrollbar border-t border-slate-100 dark:border-white/5">
                {[
                  { tag: 'Pricing', icon: <DollarSign className="h-3 w-3" /> },
                  { tag: 'How to Book', icon: <Calendar className="h-3 w-3" /> },
                  { tag: 'Availability', icon: <Info className="h-3 w-3" /> }
                ].map(item => (
                  <button 
                    key={item.tag}
                    onClick={() => { setInputText(item.tag); }}
                    className="whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all flex items-center gap-1.5"
                  >
                    {item.icon} {item.tag}
                  </button>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-grow px-5 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium dark:text-white"
              />
              <button 
                type="submit" 
                className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LuxeChatbot;

