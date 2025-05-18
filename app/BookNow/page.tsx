"use client";
import { useState, useEffect } from "react";

const FlashMessage = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-100%]"
      }`}
    >
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
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
          className="ml-4 text-white hover:text-gray-200"
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowFlash(true);
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
      } else {
        alert(data.error || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {showFlash && (
        <FlashMessage
          message="Your booking request has been submitted successfully!"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData[field as keyof typeof formData] as string}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            ))}

            <fieldset>
              <legend className="font-medium mb-2">Type of Travel</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Big Safaris",
                  "Safari & Beach",
                  "Honeymoon",
                  "The Migration",
                  "Vacation",
                  "Other",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="travelType"
                      value={type}
                      checked={formData.travelType === type}
                      onChange={handleChange}
                      required
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-medium mb-2">Accommodation Type</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Luxury",
                  "Mid Range",
                  "Honeymoon",
                  "Don't know yet",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="accommodation"
                      value={type}
                      checked={formData.accommodation === type}
                      onChange={handleChange}
                      required
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-medium mb-2">Airport Pickup</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Kilimanjaro (KIA)",
                  "Dar es salaam (JNIA)",
                  "Zanzibar (ZNZ)",
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="airportPickup"
                      value={type}
                      checked={formData.airportPickup === type}
                      onChange={handleChange}
                      required
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-medium mb-2">Trip Enhancements</legend>
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
                  <label key={enh} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tripEnhancements"
                      value={String(enh)}
                      checked={formData.tripEnhancements.includes(enh)}
                      onChange={handleChange}
                    />
                    <span>{enh}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-medium mb-2">Destinations</legend>
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
                  <label key={place} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="destinations"
                      value={String(place)}
                      checked={formData.destinations.includes(place)}
                      onChange={handleChange}
                    />
                    <span>{place}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block font-medium">Expected Start Date</label>
            <input
              type="date"
              name="expectedDate"
              value={formData.expectedDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              name="nights"
              placeholder="Number of Nights"
              value={formData.nights}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Budget Level (Per person)</option>
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
                  {opt}
                </option>
              ))}
            </select>

            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Number of adults</option>
              {[...Array(7).keys()].map((n) => (
                <option key={n + 1} value={String(n + 1)}>
                  {n + 1}
                </option>
              ))}
              <option value="More than 7">More than 7</option>
            </select>

            <select
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Number of children</option>
              <option value="0">None</option>
              {[...Array(7).keys()].map((n) => (
                <option key={n + 1} value={String(n + 1)}>
                  {n + 1}
                </option>
              ))}
              <option value="More than 7">More than 7</option>
            </select>

            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional info or special requests?"
              className="w-full p-2 border rounded"
            />

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="agreeToInfo"
                checked={formData.agreeToInfo}
                onChange={handleChange}
                required
                className="form-checkbox"
              />
              <span>
                I agree to be contacted for follow-up and additional
                information.
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="form-checkbox"
              />
              <span>I agree to the terms and conditions.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-950 text-white px-6 py-2 rounded hover:bg-blue-900 transition cursor-pointer ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
