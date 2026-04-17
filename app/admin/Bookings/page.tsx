'use client';

import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Trash2, 
  Eye, 
  Search, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  Users
} from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelType: string;
  expectedDate: string;
  budget?: string;
  adults: number;
  children: number;
  nights?: number;
  accommodation?: string;
  airportPickup?: string;
  destinations?: string[];
  additionalInfo?: string;
  createdAt: string;
}

// Flash message component
const FlashMessage = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
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
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string;
}) => {
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
            <Trash2 className="text-red-600 text-2xl" />
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
            Delete Booking
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// View Details Modal
const ViewDetailsModal = ({ booking, onClose }: { booking: Booking | null; onClose: () => void }) => {
  if (!booking) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <User className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Booking Details</h3>
              <p className="text-blue-200 text-sm">ID: {booking._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="text-amber-500 w-5 h-5" />
                Personal Information
              </h4>
              <div className="space-y-3">
                <p><span className="text-gray-500">Full Name:</span> <br/><span className="font-medium">{booking.firstName} {booking.lastName}</span></p>
                <p><span className="text-gray-500">Email:</span> <br/><span className="font-medium">{booking.email}</span></p>
                <p><span className="text-gray-500">Phone:</span> <br/><span className="font-medium">{booking.phone}</span></p>
              </div>
            </div>

            {/* Travel Details */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="text-amber-500 w-5 h-5" />
                Travel Details
              </h4>
              <div className="space-y-3">
                <p><span className="text-gray-500">Travel Type:</span> <br/><span className="font-medium">{booking.travelType}</span></p>
                <p><span className="text-gray-500">Expected Date:</span> <br/><span className="font-medium">{new Date(booking.expectedDate).toLocaleDateString()}</span></p>
                <p><span className="text-gray-500">Budget:</span> <br/><span className="font-medium">${booking.budget}</span></p>
                {booking.nights && (
                  <p><span className="text-gray-500">Nights:</span> <br/><span className="font-medium">{booking.nights}</span></p>
                )}
              </div>
            </div>

            {/* Accommodation & Airport */}
            {(booking.accommodation || booking.airportPickup) && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-amber-500 w-5 h-5" />
                  Accommodation & Transport
                </h4>
                <div className="space-y-3">
                  {booking.accommodation && (
                    <p><span className="text-gray-500">Accommodation:</span> <br/><span className="font-medium">{booking.accommodation}</span></p>
                  )}
                  {booking.airportPickup && (
                    <p><span className="text-gray-500">Airport Pickup:</span> <br/><span className="font-medium">{booking.airportPickup}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Guests */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="text-amber-500 w-5 h-5" />
                Guests
              </h4>
              <div className="space-y-3">
                <p><span className="text-gray-500">Adults:</span> <br/><span className="font-medium">{booking.adults}</span></p>
                <p><span className="text-gray-500">Children:</span> <br/><span className="font-medium">{booking.children || 0}</span></p>
              </div>
            </div>

            {/* Destinations */}
            {booking.destinations && booking.destinations.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-amber-500 w-5 h-5" />
                  Destinations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {booking.destinations.map((dest, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {booking.additionalInfo && (
              <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                <p className="text-gray-700">{booking.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={() => {
              window.location.href = `mailto:${booking.email}`;
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
          >
            Contact Customer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; bookingId: string | null }>({
    isOpen: false,
    bookingId: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [search, dateRange, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (search) {
      filtered = filtered.filter((booking) =>
        `${booking.firstName} ${booking.lastName} ${booking.email} ${booking.phone}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter((booking) => new Date(booking.expectedDate) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter((booking) => new Date(booking.expectedDate) <= new Date(dateRange.end));
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const showFlashMessage = (message: string, type: 'success' | 'error') => {
    setFlashMessage({ message, type });
  };

  const openConfirmDialog = (id: string) => {
    setConfirmDialog({ isOpen: true, bookingId: id });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, bookingId: null });
  };

  const handleDelete = async () => {
    if (!confirmDialog.bookingId) return;
    
    const id = confirmDialog.bookingId;
    closeConfirmDialog();

     try {
    // Change this to use query parameter: ?id=${id}
    const res = await fetch(`/api/admin/bookings?id=${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Check if response is OK
    if (!res.ok) {
      const errorData = await res.json();
      showFlashMessage(errorData.error || 'Failed to delete booking', 'error');
      return;
    }
    
    const data = await res.json();
    
    if (data.success) {
      // Remove the deleted booking from the state
      setBookings((prev) => prev.filter((b) => b._id !== id));
      showFlashMessage('Booking deleted successfully', 'success');
    } else {
      showFlashMessage(data.error || 'Failed to delete booking', 'error');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showFlashMessage('An error occurred while deleting the booking', 'error');
  }
};

  const exportCSV = (dataToExport = filteredBookings, filename = 'bookings') => {
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    link.click();
  };

  const exportSingleBooking = (booking: Booking) => {
    exportCSV([booking], `booking_${booking.firstName}_${booking.lastName}`);
  };

  const exportCurrentView = () => {
    exportCSV(filteredBookings, `bookings_${new Date().toISOString().split('T')[0]}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: bookings.length,
  };

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
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />

      <ViewDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Briefcase className="text-amber-500 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Bookings Management</h1>
                <p className="text-blue-200 mt-1">View, manage, and export customer bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <button
                onClick={() => {
                  setSearch('');
                  setDateRange({ start: '', end: '' });
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={exportCurrentView}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Current View
            </button>
            <button
              onClick={() => exportCSV(bookings, 'all_bookings')}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export All
            </button>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Details</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedBookings.map((booking) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.firstName} {booking.lastName}</p>
                          <p className="text-sm text-gray-500">{booking.travelType}</p>
                        </div>
                        </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {booking.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {booking.phone}
                          </p>
                        </div>
                        </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">${booking.budget}</p>
                          <p className="text-sm text-gray-600">{booking.adults} adults, {booking.children} children</p>
                        </div>
                        </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(booking.expectedDate).toLocaleDateString()}
                        </p>
                        </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => exportSingleBooking(booking)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Export"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openConfirmDialog(booking._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                        if (pageNum > totalPages) return null;
                      }
                      if (pageNum <= totalPages && (totalPages <= 5 || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2))) {
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-amber-600 text-white shadow-md'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}