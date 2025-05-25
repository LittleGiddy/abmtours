'use client';

import React, { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

const isAdmin = true; // Replace with real auth logic

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
  destinations?: string[];
  additionalInfo?: string;
  createdAt: string;
}

// Flash message component
const FlashMessage = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 
      'bg-red-100 text-red-800 border border-red-300'
    }`}>
      {message}
    </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; bookingId: string | null }>({
    isOpen: false,
    bookingId: null
  });

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
    };
    fetchBookings();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = bookings.filter((booking) =>
      `${booking.firstName} ${booking.lastName}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const showFlashMessage = (message: string, type: 'success' | 'error') => {
    setFlashMessage({ message, type });
    setTimeout(() => setFlashMessage(null), 3000); // Hide after 3 seconds
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
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setFilteredBookings((prev) => prev.filter((b) => b._id !== id));
        showFlashMessage('Booking deleted successfully', 'success');
      } else {
        const errorData = await res.json();
        showFlashMessage(errorData.error || 'Failed to delete booking', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showFlashMessage('An error occurred while deleting the booking', 'error');
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(filteredBookings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bookings.csv');
    link.click();
  };

  if (!isAdmin) {
    return <div className="p-4 text-center text-red-600">Access Denied</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />

      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-1/2"
        />
        <button
          onClick={exportCSV}
          className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Download size={18} /> <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="hidden md:table min-w-full bg-white border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Travel Type</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Budget</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="border-t">
                <td className="px-4 py-2 border">
                  {booking.firstName} {booking.lastName}
                </td>
                <td className="px-4 py-2 border">{booking.email}</td>
                <td className="px-4 py-2 border">{booking.phone}</td>
                <td className="px-4 py-2 border">{booking.travelType}</td>
                <td className="px-4 py-2 border">{booking.expectedDate}</td>
                <td className="px-4 py-2 border">{booking.budget || 'N/A'}</td>
                <td className="px-4 py-2 border text-red-600 cursor-pointer">
                  <button onClick={() => openConfirmDialog(booking._id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center" colSpan={7}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="p-4 text-center">No bookings found.</div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {booking.firstName} {booking.lastName}
                  </h3>
                  <button 
                    onClick={() => openConfirmDialog(booking._id)}
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {booking.email}</p>
                  <p><span className="font-medium">Phone:</span> {booking.phone}</p>
                  <p><span className="font-medium">Travel Type:</span> {booking.travelType}</p>
                  <p><span className="font-medium">Date:</span> {booking.expectedDate}</p>
                  <p><span className="font-medium">Budget:</span> {booking.budget || 'N/A'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

