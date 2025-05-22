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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');

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

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this booking?');
    if (!confirmed) return;

    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setFilteredBookings((prev) => prev.filter((b) => b._id !== id));
    } else {
      alert('Failed to delete booking.');
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
          className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto justify-center"
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
                  <button onClick={() => handleDelete(booking._id)}>
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
                    onClick={() => handleDelete(booking._id)}
                    className="text-red-600"
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
