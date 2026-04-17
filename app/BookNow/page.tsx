"use client";
import { useState, useEffect } from "react";
import { Calendar, Users, Plane, Hotel, MapPin, Phone, Mail, User, CreditCard, Clock, ChevronRight, Sparkles, Shield, Award, Star } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// Define proper types
interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelType: string;
  tripEnhancements: string[];
  accommodation: string;
  airportPickup: string;
  expectedDate: string;
  nights: string;
  budget: string;
  adults: string;
  children: string;
  destinations: string[];
  additionalInfo: string;
  agreeToTerms: boolean;
  agreeToInfo: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

// Validation helper functions
const validateField = (name: string, value: string | boolean): string => {
  switch (name) {
    case 'firstName':
      if (!value || (typeof value === 'string' && !value.trim())) return "First name is required";
      if (typeof value === 'string' && value.trim().length < 2) return "First name must be at least 2 characters";
      return "";
    case 'lastName':
      if (!value || (typeof value === 'string' && !value.trim())) return "Last name is required";
      if (typeof value === 'string' && value.trim().length < 2) return "Last name must be at least 2 characters";
      return "";
    case 'email':
      if (!value || (typeof value === 'string' && !value.trim())) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) return "Please enter a valid email address";
      return "";
    case 'phone':
      if (!value || (typeof value === 'string' && !value.trim())) return "Phone number is required";
      const phoneDigits = (typeof value === 'string' ? value : String(value)).replace(/[^0-9]/g, '');
      if (phoneDigits.length < 8) return "Please enter a valid phone number";
      return "";
    case 'travelType':
      if (!value) return "Please select a travel type";
      return "";
    case 'accommodation':
      if (!value) return "Please select accommodation type";
      return "";
    case 'airportPickup':
      if (!value) return "Please select airport pickup";
      return "";
    case 'expectedDate':
      if (!value) return "Please select expected date";
      const selectedDate = new Date(value as string);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) return "Expected date cannot be in the past";
      return "";
    case 'nights':
      if (!value) return "Number of nights is required";
      const nights = parseInt(value as string);
      if (isNaN(nights) || nights < 1) return "Must be at least 1 night";
      if (nights > 365) return "Must be less than 365 nights";
      return "";
    case 'adults':
      if (!value) return "Number of adults is required";
      const adults = parseInt(value as string);
      if (isNaN(adults) || adults < 1) return "Must be at least 1 adult";
      if (adults > 50) return "Must be less than 50 adults";
      return "";
    case 'budget':
      if (!value) return "Please select budget range";
      return "";
    case 'agreeToInfo':
      if (!value) return "You must agree to be contacted";
      return "";
    case 'agreeToTerms':
      if (!value) return "You must agree to the terms and conditions";
      return "";
    default:
      return "";
  }
};

const validateStep = (step: number, formData: FormDataType): { isValid: boolean; errors: FieldErrors } => {
  const errors: FieldErrors = {};
  let isValid = true;

  if (step === 1) {
    const fields: (keyof FormDataType)[] = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  } else if (step === 2) {
    const fields: (keyof FormDataType)[] = ['travelType', 'accommodation', 'airportPickup', 'expectedDate', 'nights', 'adults', 'budget'];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  } else if (step === 4) {
    const fields: (keyof FormDataType)[] = ['agreeToInfo', 'agreeToTerms'];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

const BookNow = () => {
  const [formData, setFormData] = useState<FormDataType>({
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

  const [showFlash, setShowFlash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

  // Auto-hide flash message after 5 seconds
  useEffect(() => {
    if (showFlash) {
      const timer = setTimeout(() => {
        setShowFlash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showFlash]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (type === "checkbox") {
      if (
        Array.isArray(formData[name as keyof FormDataType]) &&
        typeof value === "string"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: checked
            ? [...(prevState[name as keyof FormDataType] as string[]), value]
            : (prevState[name as keyof FormDataType] as string[]).filter(
                (v) => v !== value
              ),
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
        
        // Validate checkbox immediately
        if (name === 'agreeToInfo' || name === 'agreeToTerms') {
          const errorMsg = validateField(name, checked);
          setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
        }
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone: phone || "" }));
    // Clear error when user types
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handlePhoneBlur = () => {
    setTouchedFields(prev => ({ ...prev, phone: true }));
    const errorMsg = validateField("phone", formData.phone);
    setFieldErrors(prev => ({ ...prev, phone: errorMsg }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
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
    setFieldErrors({});
    setTouchedFields({});
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Final validation before submission
    const step1Validation = validateStep(1, formData);
    const step2Validation = validateStep(2, formData);
    const step4Validation = validateStep(4, formData);
    
    const allErrors = {
      ...step1Validation.errors,
      ...step2Validation.errors,
      ...step4Validation.errors
    };
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      // Mark all fields as touched to show errors
      const allTouched: TouchedFields = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);
      setError("Please fix the errors before submitting");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setShowFlash(true);
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      const err = error as Error;
      console.error('Submission error:', err);
      setError(err.message || 'There was an error submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const { isValid, errors } = validateStep(currentStep, formData);
    
    if (!isValid) {
      setFieldErrors(errors);
      // Mark current step fields as touched
      const stepFields: (keyof FormDataType)[] = currentStep === 1 
        ? ['firstName', 'lastName', 'email', 'phone']
        : currentStep === 2 
        ? ['travelType', 'accommodation', 'airportPickup', 'expectedDate', 'nights', 'adults', 'budget']
        : [];
      
      const newTouched: TouchedFields = { ...touchedFields };
      stepFields.forEach(field => {
        newTouched[field as string] = true;
      });
      setTouchedFields(newTouched);
      setError("Please fill in all required fields");
      return;
    }
    
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to check if field has error
  const hasError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName] && !!touchedFields[fieldName];
  };

  // Helper to get error message
  const getError = (fieldName: string): string => {
    return fieldErrors[fieldName] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transform scale-105"
          >
            <source src="/images/HeroVideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div className="relative z-10 px-6 max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Begin Your Journey</span>
          </div>
          <h1 className="text-5xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            Book Your Safari Adventure
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Experience the magic of Africa with our bespoke travel experiences
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>
{/* Booking Form Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {[
                { step: 1, title: "Personal Info", icon: User },
                { step: 2, title: "Travel Details", icon: Plane },
                { step: 3, title: "Preferences", icon: Hotel },
                { step: 4, title: "Review", icon: Shield },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= item.step
                        ? "bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg scale-110"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs mt-2 font-medium hidden sm:block">{item.title}</div>
                  {item.step < 4 && (
                    <div className="hidden sm:block absolute w-1/4 h-0.5 bg-gray-300 mt-6 transform -translate-y-1/2"
                         style={{ left: `${(item.step - 0.5) * 25}%`, width: '25%' }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            {/* Success Flash Message */}
            {showFlash && (
              <div className="m-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 rounded-xl animate-slide-down">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Booking Request Submitted Successfully!</p>
                    <p className="text-sm">We&apos;ll contact you within 24 hours to confirm your safari adventure.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="m-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 rounded-xl animate-slide-down">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Submission Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900">Personal Information</h3>
                    <p className="text-gray-500 mt-2">Tell us who you are</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-900" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('firstName')}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          focusedField === 'firstName'
                            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                            : hasError('firstName')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:outline-none`}
                        placeholder="John"
                      />
                      {hasError('firstName') && (
                        <p className="mt-1 text-sm text-red-500">{getError('firstName')}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('lastName')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                        placeholder="Doe"
                      />
                      {hasError('lastName') && (
                        <p className="mt-1 text-sm text-red-500">{getError('lastName')}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-900" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('email')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                        placeholder="john@example.com"
                      />
                      {hasError('email') && (
                        <p className="mt-1 text-sm text-red-500">{getError('email')}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-900" />
                        Phone Number *
                      </label>
                      <PhoneInput
                        defaultCountry="tz"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="+255 XXX XXX XXX"
                        className={`w-full [&_.react-international-phone-input-container]:w-full [&_.react-international-phone-country-selector-button]:border-2 [&_.react-international-phone-country-selector-button]:rounded-l-xl [&_.react-international-phone-input]:border-2 [&_.react-international-phone-input]:rounded-r-xl [&_.react-international-phone-input]:p-4 [&_.react-international-phone-country-selector-button]:p-4 ${
                          hasError('phone') 
                            ? '[&_.react-international-phone-country-selector-button]:border-red-500 [&_.react-international-phone-input]:border-red-500 [&_.react-international-phone-input]:bg-red-50' 
                            : '[&_.react-international-phone-country-selector-button]:border-gray-300 [&_.react-international-phone-input]:border-gray-300 hover:[&_.react-international-phone-country-selector-button]:border-blue-300 hover:[&_.react-international-phone-input]:border-blue-300'
                        }`}
                      />
                      {hasError('phone') && (
                        <p className="mt-1 text-sm text-red-500">{getError('phone')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Travel Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900">Travel Details</h3>
                    <p className="text-gray-500 mt-2">Plan your perfect safari</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Travel *</label>
                      <select
                        name="travelType"
                        value={formData.travelType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('travelType')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      >
                        <option value="">Select travel type</option>
                        {["Big Safaris", "Safari & Beach", "Honeymoon", "The Migration", "Vacation", "Other"].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {hasError('travelType') && (
                        <p className="mt-1 text-sm text-red-500">{getError('travelType')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Accommodation Type *</label>
                      <select
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('accommodation')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      >
                        <option value="">Select accommodation</option>
                        {["Luxury", "Mid Range", "Budget", "Don't know yet"].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {hasError('accommodation') && (
                        <p className="mt-1 text-sm text-red-500">{getError('accommodation')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-900" />
                        Expected Start Date *
                      </label>
                      <input
                        type="date"
                        name="expectedDate"
                        value={formData.expectedDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('expectedDate')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      />
                      {hasError('expectedDate') && (
                        <p className="mt-1 text-sm text-red-500">{getError('expectedDate')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-900" />
                        Number of Nights *
                      </label>
                      <input
                        type="number"
                        name="nights"
                        value={formData.nights}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="7"
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('nights')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      />
                      {hasError('nights') && (
                        <p className="mt-1 text-sm text-red-500">{getError('nights')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-900" />
                        Number of Adults *
                      </label>
                      <select
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('adults')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      >
                        <option value="">Select adults</option>
                        {[...Array(10).keys()].map((n) => (
                          <option key={n + 1} value={String(n + 1)}>{n + 1}</option>
                        ))}
                      </select>
                      {hasError('adults') && (
                        <p className="mt-1 text-sm text-red-500">{getError('adults')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-900" />
                        Number of Children
                      </label>
                      <select
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      >
                        <option value="0">None</option>
                        {[...Array(8).keys()].map((n) => (
                          <option key={n + 1} value={String(n + 1)}>{n + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-900" />
                        Budget Level (Per person) *
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('budget')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      >
                        <option value="">Select budget</option>
                        {["2000-4000", "5000-7000", "8000-10000", "11000-13000", "14000-16000", "17000-20000", "More than 20000"].map((budget) => (
                          <option key={budget} value={budget}>${budget}</option>
                        ))}
                      </select>
                      {hasError('budget') && (
                        <p className="mt-1 text-sm text-red-500">{getError('budget')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-900" />
                        Airport Pickup *
                      </label>
                      <select
                        name="airportPickup"
                        value={formData.airportPickup}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                          hasError('airportPickup')
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-300'
                        } focus:border-blue-500 focus:outline-none`}
                      >
                        <option value="">Select airport</option>
                        {["Kilimanjaro (KIA)", "Dar es salaam (JNIA)", "Zanzibar (ZNZ)"].map((airport) => (
                          <option key={airport} value={airport}>{airport}</option>
                        ))}
                      </select>
                      {hasError('airportPickup') && (
                        <p className="mt-1 text-sm text-red-500">{getError('airportPickup')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900">Your Preferences</h3>
                    <p className="text-gray-500 mt-2">Customize your experience</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Trip Enhancements</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Beach", "Boat Safari", "Bush Drive", "Chimps/Guerilla", "Night Game Drive", "Walking Safari", "Other"].map((enh) => (
                        <label key={enh} className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            name="tripEnhancements"
                            value={enh}
                            checked={formData.tripEnhancements.includes(enh)}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-700">{enh}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-900" />
                      Destinations
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                      {["Arusha", "Katavi National Park", "Lake Manyara", "Mafia Island", "Mahale National Park", "Mikumi National Park", "Nyerere National Park", "Ngorongoro Crater", "Pemba Island", "Ruaha National Park", "Serengeti National Park", "Tarangire National Park", "Zanzibar Beach", "Other"].map((place) => (
                        <label key={place} className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            name="destinations"
                            value={place}
                            checked={formData.destinations.includes(place)}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-700 text-sm">{place}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Any special requests, dietary restrictions, or additional information?"
                      className="w-full p-4 border-2 border-gray-300 rounded-xl hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900">Review Your Booking</h3>
                    <p className="text-gray-500 mt-2">Please confirm your details</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><strong className="text-blue-900">Name:</strong> {formData.firstName} {formData.lastName}</div>
                      <div><strong className="text-blue-900">Email:</strong> {formData.email}</div>
                      <div><strong className="text-blue-900">Phone:</strong> {formData.phone}</div>
                      <div><strong className="text-blue-900">Travel Type:</strong> {formData.travelType}</div>
                      <div><strong className="text-blue-900">Accommodation:</strong> {formData.accommodation}</div>
                      <div><strong className="text-blue-900">Start Date:</strong> {formData.expectedDate}</div>
                      <div><strong className="text-blue-900">Nights:</strong> {formData.nights}</div>
                      <div><strong className="text-blue-900">Adults:</strong> {formData.adults}</div>
                      <div><strong className="text-blue-900">Children:</strong> {formData.children || '0'}</div>
                      <div><strong className="text-blue-900">Budget:</strong> ${formData.budget}</div>
                      <div><strong className="text-blue-900">Airport Pickup:</strong> {formData.airportPickup}</div>
                      <div><strong className="text-blue-900">Enhancements:</strong> {formData.tripEnhancements.join(', ') || 'None'}</div>
                      <div className="md:col-span-2"><strong className="text-blue-900">Destinations:</strong> {formData.destinations.join(', ') || 'Not specified'}</div>
                      {formData.additionalInfo && <div className="md:col-span-2"><strong className="text-blue-900">Additional Info:</strong> {formData.additionalInfo}</div>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToInfo"
                        checked={formData.agreeToInfo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`mt-1 w-5 h-5 rounded ${
                          hasError('agreeToInfo') ? 'border-red-500' : 'text-blue-600'
                        }`}
                      />
                      <span className="text-gray-700">I agree to be contacted for follow-up and additional information. *</span>
                    </label>
                    {hasError('agreeToInfo') && (
                      <p className="text-sm text-red-500 ml-8">{getError('agreeToInfo')}</p>
                    )}
                    
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`mt-1 w-5 h-5 rounded ${
                          hasError('agreeToTerms') ? 'border-red-500' : 'text-blue-600'
                        }`}
                      />
                      <span className="text-gray-700">I agree to the terms and conditions. *</span>
                    </label>
                    {hasError('agreeToTerms') && (
                      <p className="text-sm text-red-500 ml-8">{getError('agreeToTerms')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t-2 border-gray-200">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold ml-auto cursor-pointer"
                  >
                    Next →
                  </button>
                )}
                {currentStep === 4 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-orange-800 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold ml-auto flex items-center gap-2 cursor-pointer ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Booking
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
              <Shield className="w-10 h-10 text-blue-900" />
              <div>
                <p className="font-semibold">Secure Booking</p>
                <p className="text-sm text-gray-500">Your data is protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
              <Award className="w-10 h-10 text-blue-900" />
              <div>
                <p className="font-semibold">Best Price Guarantee</p>
                <p className="text-sm text-gray-500">No hidden fees</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
              <Star className="w-10 h-10 text-blue-900" />
              <div>
                <p className="font-semibold">5-Star Service</p>
                <p className="text-sm text-gray-500">Expert travel planners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;