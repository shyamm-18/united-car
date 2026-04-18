import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, Info, Calendar, DollarSign } from 'lucide-react';
import API_BASE_URL from '../../config';

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
        const res = await fetch(`${API_BASE_URL}/api/cars`);
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



  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          fleetData: cars 
        }),
      });
      
      const data = await res.json();
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: (data.text || "I'm having trouble connecting to my intelligence core. Please try again in a moment.").replace(/\*\*/g, ''), 
        sender: 'ai', 
        time: new Date() 
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Interface Error:", error);
      const errorMsg = { 
        id: Date.now() + 1, 
        text: "I am having some connection issues, but UNITED CAR is still here for you! Please reach out to our team at 9216497682 for any luxury car inquiries or bookings.", 
        sender: 'ai', 
        time: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-[5vw] sm:right-8 z-[100] w-[90vw] sm:w-[400px] h-[75vh] sm:h-[600px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-white/40 dark:border-white/10"
          >
            {/* Glossy Header */}
            <header className="relative p-7 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 rotate-3 motion-safe:animate-pulse">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-indigo-700 rounded-full shadow-lg h-inner"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-base uppercase tracking-tighter leading-none mb-1">UNITED Concierge</h4>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">AI POWERED</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Premium Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth hide-scrollbar bg-gradient-to-b from-slate-50/30 to-white/50 dark:from-transparent dark:to-transparent">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-[13px] font-bold leading-relaxed shadow-sm transition-all ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-5 rounded-3xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto hide-scrollbar border-t border-slate-100 dark:border-white/5 glass-bg">
                {[
                  { tag: 'Rates & Fleet', icon: <DollarSign className="h-3 w-3" /> },
                  { tag: 'Quick Booking', icon: <Calendar className="h-3 w-3" /> },
                  { tag: 'Jaipur Location', icon: <Info className="h-3 w-3" /> }
                ].map(item => (
                  <button 
                    key={item.tag}
                    onClick={() => { setInputText(item.tag); }}
                    className="whitespace-nowrap px-5 py-2 rounded-2xl bg-white dark:bg-white/5 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    {item.icon} {item.tag.toUpperCase()}
                  </button>
                ))}
            </div>

            {/* Glossy Input Container */}
            <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inquire about our elite fleet..."
                  className="w-full pl-6 pr-16 py-5 rounded-3xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold dark:text-white shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isTyping}
                  className="absolute right-2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-500/30"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
              <p className="mt-3 text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">
                Luxury Assistance Powered by Gemini 1.5
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LuxeChatbot;

