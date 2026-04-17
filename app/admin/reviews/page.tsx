'use client';

import React, { useEffect, useState } from 'react';
import { FaStar, FaTrash, FaEdit, FaSave, FaTimes, FaPlus,FaCheckCircle} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  createdAt: string;
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    text: '',
    date: new Date().toISOString().split('T')[0],
    verified: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingReview 
        ? `/api/reviews/${editingReview._id}`
        : '/api/reviews';
      
      const method = editingReview ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchReviews();
        setShowModal(false);
        setEditingReview(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      text: review.text,
      date: new Date(review.date).toISOString().split('T')[0],
      verified: review.verified,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      text: '',
      date: new Date().toISOString().split('T')[0],
      verified: true,
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer inline-block`}
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove customer reviews</p>
        </div>
        <button
          onClick={() => {
            setEditingReview(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
        >
          <FaPlus /> Add New Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900">
            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Verified Reviews</p>
          <p className="text-3xl font-bold text-gray-900">
            {reviews.filter(r => r.verified).length}
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{review.name}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700 max-w-md truncate">{review.text}</p>
                   </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                   </td>
                  <td className="px-6 py-4">
                    {review.verified ? (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <FaCheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Pending</span>
                    )}
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                   </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Add/Edit Modal - Without Image Field */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingReview ? 'Edit Review' : 'Add New Review'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                    <div className="flex items-center gap-1 text-2xl">
                      {renderStars(formData.rating)}
                      <span className="ml-2 text-gray-600 text-sm">({formData.rating}/5)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Write the review here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Verified Customer</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2"
                    >
                      <FaSave /> {editingReview ? 'Update Review' : 'Add Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviewsPage;