'use client';

import { useEffect, useState } from 'react';
import { FaTrash, FaEye, FaEnvelope, FaUser, FaCalendar, FaTimes, FaInbox, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Flash message component
const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-500/90 text-white border border-green-400' 
          : 'bg-red-500/90 text-white border border-red-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          {type === 'success' ? '✓' : '✕'}
        </div>
        <p className="font-medium">{message}</p>
      </div>
    </motion.div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            Delete Message
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Message Card Component
const MessageCard = ({ message, onView, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
              {message.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{message.fullName}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <FaEnvelope className="w-3 h-3" />
                <span>{message.email}</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <FaCalendar className="w-3 h-3" />
            <span>{formatDate(message.createdAt)}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-gray-700 text-sm line-clamp-2">
            {message.message}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(message)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FaEye className="w-4 h-4" />
            View Full Message
          </button>
          <button
            onClick={() => onDelete(message._id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    messageId: null
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data);
      setFilteredMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const filterMessages = () => {
    if (!searchTerm.trim()) {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(msg => 
        msg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
    setCurrentPage(1);
  };

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
  };

  const openConfirmDialog = (id) => {
    setConfirmDialog({ isOpen: true, messageId: id });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, messageId: null });
  };

  const handleDelete = async () => {
    if (!confirmDialog.messageId) return;
    
    const id = confirmDialog.messageId;
    closeConfirmDialog();

    try {
      const res = await fetch(`/api/contact/Messages/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        showFlashMessage('Message deleted successfully', 'success');
      } else {
        showFlashMessage('Failed to delete message', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showFlashMessage('An error occurred while deleting the message', 'error');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AnimatePresence>
        {flashMessage && (
          <FlashMessage 
            message={flashMessage.message} 
            type={flashMessage.type} 
            onClose={() => setFlashMessage(null)}
          />
        )}
      </AnimatePresence>
      
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FaInbox className="text-amber-500 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Messages</h1>
                <p className="text-blue-200 mt-1">Manage customer inquiries and messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaInbox className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Unread</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {messages.filter(m => !m.isRead).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <FaEnvelope className="text-amber-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-green-600">
                    {messages.filter(m => {
                      const date = new Date(m.createdAt);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaCalendar className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Messages Grid */}
          {paginatedMessages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FaInbox className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No messages found</h3>
              <p className="text-gray-500">Messages from customers will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMessages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onView={setSelectedMessage}
                  onDelete={openConfirmDialog}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for full message */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <FaUser className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedMessage.fullName}</h3>
                    <p className="text-blue-200 text-sm">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FaCalendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaEnvelope className="text-amber-500" />
                      Message
                    </h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}`;
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                >
                  Reply via Email
                </button>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    openConfirmDialog(selectedMessage._id);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}