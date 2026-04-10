import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const ReviewList = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/car/${carId}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [carId]);

  if (loading) return <div className="animate-pulse space-y-4">
    {[1, 2].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>)}
  </div>;

  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <motion.div 
            key={review._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold dark:text-white capitalize">{review.name}</h5>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {review.comment}
            </p>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
           <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
           <p className="text-slate-500 font-medium">No reviews yet. Be the first!</p>
        </div>
      )}
    </div>
  );
};

export const ReviewForm = ({ carId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ carId, rating, comment })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="p-8 text-center bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
       <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">Log in to share your experience</p>
       <a href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Login</a>
    </div>
  );

  return (
    <div className="glass p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl">
      <h4 className="text-xl font-black mb-6 flex items-center gap-2">
        <Star className="h-6 w-6 text-yellow-500" /> Share Your Review
      </h4>

      {success ? (
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-bold text-green-600">Review submitted. Thank you!</p>
            <button onClick={() => setSuccess(false)} className="mt-4 text-blue-600 underline text-sm">Write another</button>
         </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2">Rating</label>
            <div className="flex gap-2 ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className={`h-8 w-8 ${(hover || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2">Comment</label>
            <textarea 
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the driving experience..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] font-medium"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold flex items-center gap-2 ml-2"><AlertCircle className="h-4 w-4" /> {error}</p>}

          <button 
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Posting...' : <><Send className="h-5 w-5" /> Post Review</>}
          </button>
        </form>
      )}
    </div>
  );
};
