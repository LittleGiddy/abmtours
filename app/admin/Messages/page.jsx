'use client';

import { useEffect, useState } from 'react';

// Flash message component
const FlashMessage = ({ message, type }) => {
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
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
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

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    messageId: null
  });

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Failed to load messages:', err));
  }, []);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => setFlashMessage(null), 3000); // Hide after 3 seconds
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
        const errorData = await res.json();
        showFlashMessage(errorData.error || 'Failed to delete message', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showFlashMessage('An error occurred while deleting the message', 'error');
    }
  };

  return (
    <div className="px-4 md:px-12 py-6">
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}
      
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
      />

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
                      className="bg-blue-950 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openConfirmDialog(msg._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
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
                className="bg-blue-950 text-white px-3 py-1 rounded cursor-pointer"
              >
                View
              </button>
              <button
                onClick={() => openConfirmDialog(msg._id)}
                className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
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
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

