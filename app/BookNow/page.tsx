"use client";
import { useState } from "react";

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

  const [flashMessage, setFlashMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
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

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFlashMessage("🎉 Your booking request has been submitted successfully!");
        setTimeout(() => setFlashMessage(""), 5000); // hide after 5s

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
        setFlashMessage(data.error || "⚠️ Something went wrong, please try again.");
        setTimeout(() => setFlashMessage(""), 5000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFlashMessage("❌ There was an error submitting your request.");
      setTimeout(() => setFlashMessage(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* FLASH MESSAGE */}
      {flashMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {flashMessage}
        </div>
      )}

      {/* Hero Section */}
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

      {/* Booking Form */}
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

            {/* Add the rest of your form fields (radio buttons, checkboxes, date, budget, etc.) here */}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Submit Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
