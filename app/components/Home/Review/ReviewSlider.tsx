'use client';

import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaGoogle, FaCheckCircle, FaCalendarAlt, FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  profileImage: string | null;
  verified: boolean;
  createdAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        updateStats(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (reviewsList: Review[]) => {
    if (reviewsList.length === 0) {
      setAverageRating(0);
      setTotalRatings(0);
      return;
    }
    
    const total = reviewsList.reduce((sum, review) => sum + review.rating, 0);
    const avg = total / reviewsList.length;
    setAverageRating(avg);
    setTotalRatings(reviewsList.length);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-500 w-3.5 h-3.5" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-500 w-3.5 h-3.5" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-500 w-3.5 h-3.5" />);
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openGoogleReviews = () => {
    window.open('https://search.google.com/local/writereview?placeid=${placeId}', '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Compact Header with Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-200">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-1">
              {renderStars(averageRating)}
            </div>
            <div className="text-gray-300 text-xs mt-1">
              {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <div className="flex items-center gap-2">
              <FaGoogle className="text-amber-600" />
              <span className="font-medium text-white text-sm">Google Rating</span>
            </div>
            <p className="text-gray-300 text-xs">Join 500+ happy travelers</p>
          </div>
        </div>
        
        <button
          onClick={openGoogleReviews}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow cursor-pointer"
        >
          <FaGoogle size={14} />
          Write a Review
          <FaExternalLinkAlt size={10} className="opacity-70" />
        </button>
      </div>

      {/* Reviews List - Compact Cards */}
      <div className="space-y-3">
        {reviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Review Header - Always Visible */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(review._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                    {review.profileImage ? (
                      <img src={review.profileImage} alt={review.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUser size={14} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                      {review.verified && (
                        <FaCheckCircle className="text-green-500 text-xs" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaCalendarAlt size={10} />
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                <div className="text-amber-500 ml-2">
                  {expandedId === review._id ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </div>
              </div>
            </div>

            {/* Review Content - Expandable */}
            <AnimatePresence>
              {expandedId === review._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <div className="relative">
                      <div className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                        <span className="text-amber-500 font-medium text-xs block mb-2">Review</span>
                        {review.text}
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* View All on Google Link */}
      <div className="text-center mt-6">
        <button
          onClick={openGoogleReviews}
          className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1 mx-auto transition-colors font-medium cursor-pointer"
        >
          <FaGoogle size={12} />
          View all {totalRatings} reviews on Google
          <FaExternalLinkAlt size={10} />
        </button>
      </div>
    </div>
  );
};

export default Reviews;