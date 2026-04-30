'use client';

import { useEffect, useState } from 'react';
import { 
  MdMessage, 
  MdEventNote, 
  MdRefresh, 
  MdDashboard, 
  MdTrendingUp,
  MdAttachMoney,
  MdVisibility,
  MdAdd
} from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  expectedDate: string;
  status?: string;
  createdAt: string;
}

interface Message {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalMessages: 0,
    pendingBookings: 0,
    unreadMessages: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Use correct bookings endpoint
      const bookingsRes = await fetch('/api/admin/bookings');
      const bookingsData = await bookingsRes.json();
      const bookingsList = Array.isArray(bookingsData) ? bookingsData : [];
      setBookings(bookingsList.slice(0, 5));
      
      // ✅ Use correct messages endpoint (adjust if needed)
      const messagesRes = await fetch('/api/contact');
      const messagesData = await messagesRes.json();
      const messagesList = Array.isArray(messagesData) ? messagesData : [];
      setMessages(messagesList.slice(0, 5));
      
      const pending = bookingsList.filter((b: Booking) => b.status === 'pending' || !b.status).length;
      const unread = messagesList.filter((m: Message) => !m.isRead).length;
      
      setStats({
        totalBookings: bookingsList.length,
        totalMessages: messagesList.length,
        pendingBookings: pending,
        unreadMessages: unread,
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || 'pending';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    const className = styles[s as keyof typeof styles] || styles.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{s}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MdDashboard className="text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchData}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow transition flex items-center gap-2 text-gray-600 hover:text-blue-600"
              disabled={loading}
            >
              <MdRefresh className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <MdEventNote size={24} />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-400">All time</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Messages</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalMessages}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <MdMessage size={24} />
              </div>
            </div>
            <div className="mt-3 text-sm">
              {stats.unreadMessages > 0 && (
                <span className="text-orange-500 font-medium">{stats.unreadMessages} unread</span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingBookings}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <MdTrendingUp size={24} />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-400">Awaiting confirmation</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalBookings > 0 
                    ? Math.round((stats.totalBookings - stats.pendingBookings) / stats.totalBookings * 100) 
                    : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <MdAttachMoney size={24} />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-400">Confirmed / Total</div>
          </div>
        </div>

        {/* Recent Bookings & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MdEventNote className="text-blue-600" />
                Recent Bookings
              </h2>
              <a href="/admin/Bookings" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                View all <MdVisibility size={16} />
              </a>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No bookings yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {booking.firstName} {booking.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{booking.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(booking.expectedDate)}</p>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MdMessage className="text-green-600" />
                Recent Messages
              </h2>
              <a href="/admin/Messages" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                View all <MdVisibility size={16} />
              </a>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No messages yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div key={msg._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{msg.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                        {!msg.isRead && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1"></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/Bookings"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center group"
          >
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:scale-110 transition">
              <MdEventNote size={24} />
            </div>
            <span className="mt-2 font-medium text-gray-700">Manage Bookings</span>
          </a>
          <a
            href="/admin/Messages"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center group"
          >
            <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:scale-110 transition">
              <MdMessage size={24} />
            </div>
            <span className="mt-2 font-medium text-gray-700">View Messages</span>
          </a>
          <a
            href="/admin/destinations"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center group"
          >
            <div className="bg-amber-50 p-3 rounded-full text-amber-600 group-hover:scale-110 transition">
              <MdAdd size={24} />
            </div>
            <span className="mt-2 font-medium text-gray-700">Add Destination</span>
          </a>
          <button
            onClick={fetchData}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center group"
          >
            <div className="bg-gray-50 p-3 rounded-full text-gray-600 group-hover:scale-110 transition">
              <MdRefresh size={24} />
            </div>
            <span className="mt-2 font-medium text-gray-700">Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}