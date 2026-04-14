'use client';

import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  profilePhoto?: string | null;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const fetchGoogleReviews = async () => {
    try {
      console.log('Fetching Google reviews...');
      const response = await fetch('/api/google-reviews');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
      } else {
        setError(data.error || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  const openGoogleReviewForm = () => {
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    window.open(googleReviewUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Rating Summary */}
      <div className="mb-6 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <FaGoogle className="text-white text-3xl" />
          <h3 className="text-2xl font-bold text-white">Google Reviews</h3>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</p>
            <div className="flex items-center gap-1 my-2">
              {renderStars(averageRating)}
            </div>
            <p className="text-white/80 text-sm">{totalRatings} reviews</p>
          </div>
          
          <button
            onClick={openGoogleReviewForm}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold cursor-pointer flex items-center gap-2 text-sm"
          >
            <FaGoogle />
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-3">
              {review.profilePhoto ? (
                <img
                  src={review.profilePhoto}
                  alt={review.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                
                <div className="flex items-center gap-0.5 mb-2">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{review.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {reviews.length === 0 && !error && (
          <div className="text-center text-white py-8">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-yellow-400 py-8">
            <p>{error}</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GoogleReviews;