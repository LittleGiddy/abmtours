'use client';

import { useEffect, useState } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Failed to load messages:', err));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm('Delete this message?');
    if (!confirmed) return;

    const res = await fetch(`/api/contact/Messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    }
  };

  return (
    <div className="px-4 md:px-12 py-6">
      <h2 className="text-lg md:text-2xl font-bold mb-4">Messages</h2>

      {/* Table layout for medium and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[600px] w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Full Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-t">
                <td className="p-2">{msg.fullName}</td>
                <td className="p-2">{msg.email}</td>
                <td className="p-2">{msg.message?.slice(0, 30)}...</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="bg-blue-950 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card-style list for small screens */}
      <div className="md:hidden space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white border rounded-lg p-4 shadow-sm space-y-2"
          >
            <p><span className="font-semibold">Full Name:</span> {msg.fullName}</p>
            <p><span className="font-semibold">Email:</span> {msg.email}</p>
            <p>
              <span className="font-semibold">Message:</span><br />
              <span className="whitespace-pre-line">{msg.message}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => setSelectedMessage(msg)}
                className="bg-blue-950 text-white px-3 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(msg._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-base md:text-xl font-semibold mb-3">Message Details</h3>
            <p className="mb-2 text-sm md:text-base"><strong>Full Name:</strong> {selectedMessage.fullName}</p>
            <p className="mb-2 text-sm md:text-base"><strong>Email:</strong> {selectedMessage.email}</p>
            <p className="mb-2 whitespace-pre-wrap text-sm md:text-base">
              <strong>Message:</strong><br />{selectedMessage.message}
            </p>
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
