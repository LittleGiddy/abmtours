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

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your booking request has been submitted.");
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* ... (rest of the JSX remains exactly the same) ... */}
    </div>
  );
};

export default BookNow;
