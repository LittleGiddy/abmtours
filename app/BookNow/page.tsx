"use client";
import { useState, useEffect } from "react";

const FlashMessage = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 7000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
          className="ml-4 text-green-500 hover:text-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BookNow = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelType: "",
    tripEnhancements: [] as string[],
    accommodation: "",
    airportPickup: "",
    expectedDate: "",
    nights: "",
    budget: "",
    adults: "",
    children: "",
    destinations: [] as string[],
    additionalInfo: "",
    agreeToTerms: false,
    agreeToInfo: false,
  });

  const [showFlash, setShowFlash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    if (type === "checkbox") {
      if (
        Array.isArray(formData[name as keyof typeof formData]) &&
        typeof value === "string"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: checked
            ? [...(prevState[name as keyof typeof formData] as string[]), value]
            : (prevState[name as keyof typeof formData] as string[]).filter(
                (v) => v !== value
              ),
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      travelType: "",
      tripEnhancements: [],
      accommodation: "",
      airportPickup: "",
      expectedDate: "",
      nights: "",
      budget: "",
      adults: "",
      children: "",
      destinations: [],
      additionalInfo: "",
      agreeToTerms: false,
      agreeToInfo: false,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    // Send email notification
    const emailRes = await fetch('/api/send-booking-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Check if response is not OK
    if (!emailRes.ok) {
      // Try to parse as JSON, but handle HTML responses
      const contentType = emailRes.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await emailRes.json();
        throw new Error(errorData.error || 'Email notification failed');
      } else {
        // Handle non-JSON response
        throw new Error('Email notification failed: Server error');
      }
    }

    // Save booking to database
    const bookingRes = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Check if response is not OK
    if (!bookingRes.ok) {
      // Try to parse as JSON, but handle HTML responses
      const contentType = bookingRes.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await bookingRes.json();
        throw new Error(errorData.error || 'Failed to save booking');
      } else {
        // Handle non-JSON response
        throw new Error('Failed to save booking: Server error');
      }
    }

    // Show success message and reset form
    setShowFlash(true);
    resetForm();
    
  } catch (error) {
    const err = error as Error;
    console.error('Submission error:', err);
    setError(err.message || 'There was an error submitting your request');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {showFlash && (
        <FlashMessage
          message="Your booking request has been submitted successfully! We'll contact you soon."
          onClose={() => setShowFlash(false)}
        />
      )}

      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl font-bold">Booking Request</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Your journey begins here! We are committed to crafting exceptional
            travel experiences.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Begin Your Adventure
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Tell us your travel plans, and we will be in touch within 24 hours.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Travel Type */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-lg mb-2">Type of Travel *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Big Safaris",
                  "Safari & Beach",
                  "Honeymoon",
                  "The Migration",
                  "Vacation",
                  "Other",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="travelType"
                      value={type}
                      checked={formData.travelType === type}
                      onChange={handleChange}
                      required
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Accommodation Type */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-lg mb-2">Accommodation Type *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Luxury",
                  "Mid Range",
                  "Honeymoon",
                  "Don't know yet",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="accommodation"
                      value={type}
                      checked={formData.accommodation === type}
                      onChange={handleChange}
                      required
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Airport Pickup */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-lg mb-2">Airport Pickup *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Kilimanjaro (KIA)",
                  "Dar es salaam (JNIA)",
                  "Zanzibar (ZNZ)",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="airportPickup"
                      value={type}
                      checked={formData.airportPickup === type}
                      onChange={handleChange}
                      required
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Trip Enhancements */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-lg mb-2">Trip Enhancements</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Beach",
                  "Boat Safari",
                  "Bush Drive",
                  "Chimps/Guerilla",
                  "Night Game Drive",
                  "Walking Safari",
                  "Other",
                ].map((enh) => (
                  <label key={enh} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="tripEnhancements"
                      value={enh}
                      checked={formData.tripEnhancements.includes(enh)}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{enh}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Destinations */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-lg mb-2">Destinations</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Arusha",
                  "Katavi National Park",
                  "Lake Manyara",
                  "Mafia Island",
                  "Mahale National Park",
                  "Mikumi National Park",
                  "Nyerere National Park",
                  "Ngorongoro Crater",
                  "Pemba Island",
                  "Ruaha National Park",
                  "Serengeti National Park",
                  "Tarangire Nationa",
                  "Zanzibar Beach",
                  "Other",
                ].map((place) => (
                  <label key={place} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="destinations"
                      value={place}
                      checked={formData.destinations.includes(place)}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{place}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Start Date *
                </label>
                <input
                  type="date"
                  name="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Nights *
                </label>
                <input
                  type="text"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Level (Per person) *
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select budget range</option>
                {[
                  "2000 - 4000",
                  "5000 - 7000",
                  "8000 - 10000",
                  "11000 - 13000",
                  "14000 - 16000",
                  "17000 - 20000",
                  "More than 20000",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    ${opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Travelers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of adults *
                </label>
                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select number of adults</option>
                  {[...Array(7).keys()].map((n) => (
                    <option key={n + 1} value={String(n + 1)}>
                      {n + 1}
                    </option>
                  ))}
                  <option value="More than 7">More than 7</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of children
                </label>
                <select
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select number of children</option>
                  <option value="0">None</option>
                  {[...Array(7).keys()].map((n) => (
                    <option key={n + 1} value={String(n + 1)}>
                      {n + 1}
                    </option>
                  ))}
                  <option value="More than 7">More than 7</option>
                </select>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requests or additional information?"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToInfo"
                  checked={formData.agreeToInfo}
                  onChange={handleChange}
                  required
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  I agree to be contacted for follow-up and additional information. *
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  I agree to the terms and conditions. *
                </span>
              </label>
            </div>

            {/* Success Flash Message - Placed above the submit button */}
            {showFlash && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Your booking request has been submitted successfully! We&apos;ll contact you soon.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-colors cursor-pointer ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Booking Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookNow;






