"use client";

import SectionHeading from "../Helper/SectionHeading";
import { useState, useEffect } from "react";

export default function SendUsEmail() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Auto-hide flash message after 4 seconds
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 4000); // 4 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [flashMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFlashMessage(null); // Clear previous message

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFlashMessage({
          type: "success",
          message: "Message sent successfully!",
        });
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        setFlashMessage({
          type: "error",
          message: result.error || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFlashMessage({
        type: "error",
        message: "Error submitting form.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 bg-gray-100 px-4">
      <div className="w-full max-w-3xl text-center">
        {/* Section Heading */}
        <SectionHeading heading="Send Us a Message" tagline="" />

        {/* Flash Message */}
        {flashMessage && (
          <div
            className={`my-4 p-4 rounded-lg font-medium transition-opacity duration-300 ${
              flashMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full mt-6"
        >
          <label className="block font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <label className="block font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="gideon@email.com"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full mb-4"
            required
          />

          <label className="block font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            placeholder="Type your message"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mb-4"
            required
          />

          <button
            type="submit"
            className="px-8 py-2 text-white text-base bg-blue-950 hover:bg-blue-900 rounded-lg cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
