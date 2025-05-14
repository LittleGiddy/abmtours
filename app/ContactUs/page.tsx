'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState<"success" | "error" | "">("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFlashMessage("");
    setFlashType("");

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
        setFlashMessage("Message sent successfully to ABM Team!");
        setFlashType("success");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        setFlashMessage(result.error || "Something went wrong.");
        setFlashType("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFlashMessage("Error submitting form.");
      setFlashType("error");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setFlashMessage("");
        setFlashType("");
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
          <h1 className="text-4xl font-bold">Be Connected</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            We are here to connect with you! Whether you have questions, need
            support, or want to collaborate, our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <main className="flex-grow pt-24">
        <div className="max-w-5xl mx-auto text-blue-950 p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Contact Us Today
          </h2>

          {/* Flash Message */}
          {flashMessage && (
            <div
              className={`p-4 mb-6 rounded-lg text-sm font-medium text-center ${
                flashType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {flashMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-950" />
                <span>123 Main Street, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-950" />
                <a
                  href="tel:+255678991004"
                  className="text-blue-950 hover:underline"
                >
                  +255 678 991 004
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-950" />
                <a
                  href="mailto:info@example.com"
                  className="text-blue-950 hover:underline"
                >
                  info@abmtours.or.tz
                </a>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.726367996198!2d39.25415101535452!3d-6.792354095092241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4c59c9999999%3A0x1eea82db00000000!2sDar%20es%20Salaam!5e0!3m2!1sen!2stz!4v1610000000000!5m2!1sen!2stz"
                width="100%"
                height="60%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="fullName"
                placeholder="Your Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 text-white text-base bg-blue-950 hover:bg-blue-900 rounded-lg cursor-pointer"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
