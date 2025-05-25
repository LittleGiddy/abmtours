'use client';

import { useEffect, useState } from 'react';
import { MdMessage, MdEventNote } from 'react-icons/md';

export default function AdminDashboard() {
  const [messageCount, setMessageCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    // Fetch messages
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => setMessageCount(data.length))
      .catch((err) => console.error('Failed to load message count:', err));

    // Fetch bookings
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookingCount(data.length))
      .catch((err) => console.error('Failed to load booking count:', err));
  }, []);

  return (
    <div className="w-full min-h-screen p-8 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Messages Card */}
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-6 shadow hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-full text-orange-600">
              <MdMessage size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Messages</h3>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-blue-900">{messageCount}</div>
        </div>

        {/* Bookings Card */}
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-6 shadow hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-full text-orange-600">
              <MdEventNote size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Bookings</h3>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-blue-900">{bookingCount}</div>
        </div>
      </div>
    </div>
  );
}
