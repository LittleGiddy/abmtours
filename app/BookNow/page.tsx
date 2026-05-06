// app/BookNow/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Calendar, Users, Plane, Hotel, MapPin, Phone, Mail, User,
  Clock, ChevronRight, Sparkles, Shield, Award, Star,
  CheckCircle, Info, Globe, Compass, Coffee,
  Heart, Briefcase
} from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import AdsterraBanner from "../components/AdsterraBanner";

// ---------- Types ----------
interface PriceTier {
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
}

interface Option {
  optionTitle: string;
  description: string;
  activities: string;
  mainImage: string;
  priceType: "fixed" | "tiered" | "contact";
  priceAmount: number | null;
  priceTiers?: PriceTier[];
  accommodationImages?: string[];
  showMoreContent?: string;
}

interface Package {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  cardImage: string;
  heroImage: string;
  overview: string;
  highlights: string[];
  options: Option[];
}

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

const circuitInfo: Record<string, { description: string; icon: string }> = {
  "Northern Circuit": {
    description: "Serengeti, Ngorongoro Crater, Lake Manyara – the classic safari route, great for the Great Migration.",
    icon: "🦁",
  },
  "Southern Circuit": {
    description: "Ruaha, Nyerere (Selous) – vast, remote wilderness, ideal for off‑the‑beaten‑path adventures.",
    icon: "🐘",
  },
  "Beach Vacation": {
    description: "Zanzibar, Mafia, Pemba – white sands, turquoise water, and Swahili culture.",
    icon: "🏖️",
  },
};

const getOptionPriceDisplay = (opt: Option): string => {
  if (opt.priceType === "fixed" && opt.priceAmount) {
    return `$${opt.priceAmount.toLocaleString()}`;
  } else if (opt.priceType === "tiered" && opt.priceTiers && opt.priceTiers.length) {
    const min = Math.min(...opt.priceTiers.map(t => t.pricePerPerson));
    const max = Math.max(...opt.priceTiers.map(t => t.pricePerPerson));
    return min === max ? `$${min.toLocaleString()}` : `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  return "Contact for price";
};

// ---------- Validation (no `any`) ----------
type FieldValue = string | boolean | string[];

const validateField = (name: keyof FormDataType, value: FieldValue): string => {
  if (Array.isArray(value)) return "";
  const stringVal = value?.toString() || "";
  switch (name) {
    case "firstName":
      if (!stringVal.trim()) return "First name required";
      if (stringVal.trim().length < 2) return "At least 2 characters";
      return "";
    case "lastName":
      if (!stringVal.trim()) return "Last name required";
      if (stringVal.trim().length < 2) return "At least 2 characters";
      return "";
    case "email":
      if (!stringVal.trim()) return "Email required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringVal)) return "Invalid email";
      return "";
    case "phone":
      if (!stringVal.trim()) return "Phone required";
      if (stringVal.replace(/[^0-9]/g, "").length < 8) return "Invalid phone number";
      return "";
    case "travelType":
      if (!value) return "Please select a package";
      return "";
    case "accommodation":
      if (!stringVal) return "Select accommodation type";
      return "";
    case "airportPickup":
      if (!stringVal) return "Select airport pickup";
      return "";
    case "expectedDate":
      if (!stringVal) return "Select expected date";
      const selectedDate = new Date(stringVal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) return "Date cannot be in the past";
      return "";
    case "nights":
      if (!stringVal) return "Nights required";
      const nights = parseInt(stringVal);
      if (isNaN(nights) || nights < 1) return "Must be at least 1 night";
      if (nights > 365) return "Max 365 nights";
      return "";
    case "adults":
      if (!stringVal) return "Adults required";
      const adults = parseInt(stringVal);
      if (isNaN(adults) || adults < 1) return "At least 1 adult";
      if (adults > 50) return "Max 50 adults";
      return "";
    case "budget":
      if (!stringVal) return "Budget required";
      return "";
    case "agreeToInfo":
      if (value !== true) return "You must agree to be contacted";
      return "";
    case "agreeToTerms":
      if (value !== true) return "You must agree to terms";
      return "";
    default:
      return "";
  }
};

const validateStep = (step: number, formData: FormDataType) => {
  const errors: Partial<Record<keyof FormDataType, string>> = {};
  let isValid = true;
  if (step === 1) {
    const fields: (keyof FormDataType)[] = ["firstName", "lastName", "email", "phone"];
    for (const f of fields) {
      const err = validateField(f, formData[f]);
      if (err) {
        errors[f] = err;
        isValid = false;
      }
    }
  } else if (step === 2) {
    const fields: (keyof FormDataType)[] = ["travelType", "accommodation", "airportPickup", "expectedDate", "nights", "adults", "budget"];
    for (const f of fields) {
      const err = validateField(f, formData[f]);
      if (err) {
        errors[f] = err;
        isValid = false;
      }
    }
  } else if (step === 4) {
    const fields: (keyof FormDataType)[] = ["agreeToInfo", "agreeToTerms"];
    for (const f of fields) {
      const err = validateField(f, formData[f]);
      if (err) {
        errors[f] = err;
        isValid = false;
      }
    }
  }
  return { isValid, errors };
};

// Custom type for AudioContext with webkit fallback
interface AudioContextWithWebkit extends AudioContext {
  webkitAudioContext?: typeof AudioContext;
}

export default function BookNow() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("package");

  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [formData, setFormData] = useState<FormDataType>({
    firstName: "", lastName: "", email: "", phone: "", travelType: "",
    tripEnhancements: [], accommodation: "", airportPickup: "", expectedDate: "",
    nights: "", budget: "", adults: "2", children: "0", destinations: [],
    additionalInfo: "", agreeToTerms: false, agreeToInfo: false,
  });

  const [showFlash, setShowFlash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormDataType, boolean>>>({});

  // Play success tone using Web Audio API – typed version
  const playSuccessTone = () => {
    try {
      // Type-safe access to AudioContext
      const AudioCtor = (window as AudioContextWithWebkit).AudioContext || (window as AudioContextWithWebkit).webkitAudioContext;
      if (!AudioCtor) return;
      const audioCtx = new AudioCtor();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 880; // A5 note
      gainNode.gain.value = 0.3;
      oscillator.type = "sine";
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.warn("Could not play success sound:", err);
    }
  };

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as Package[];
        setPackages(data);
      } catch (err) {
        console.error(err);
        setError("Could not load safari packages.");
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  // Auto-select from URL param
  useEffect(() => {
    if (slugParam && packages.length > 0 && !selectedPackage) {
      const found = packages.find(p => p.slug === slugParam);
      if (found) {
        setSelectedCircuit(found.category);
        setSelectedPackage(found);
        if (found.options && found.options.length) {
          setSelectedOption(found.options[0]);
          autoFillFromPackage(found, found.options[0]);
        }
      }
    }
  }, [slugParam, packages, selectedPackage]);

  const autoFillFromPackage = (pkg: Package, opt: Option) => {
    const nightsMatch = pkg.title.match(/(\d+)[-\s]*[Dd]ay/);
    const nights = nightsMatch ? nightsMatch[1] : "";
    let budgetDisplay = "";
    if (opt.priceType === "fixed" && opt.priceAmount) budgetDisplay = `$${opt.priceAmount.toLocaleString()} per person (fixed)`;
    else if (opt.priceType === "tiered" && opt.priceTiers?.length) {
      const min = Math.min(...opt.priceTiers.map(t => t.pricePerPerson));
      const max = Math.max(...opt.priceTiers.map(t => t.pricePerPerson));
      budgetDisplay = min === max ? `$${min.toLocaleString()} per person` : `$${min.toLocaleString()} - $${max.toLocaleString()} per person`;
    } else budgetDisplay = "Contact for price";
    const destinationsArray = [pkg.category];
    const parkMatch = pkg.title.match(/(Serengeti|Ngorongoro|Tarangire|Manyara|Ruaha|Nyerere|Zanzibar|Mikumi)/i);
    if (parkMatch) destinationsArray.push(parkMatch[0]);
    const additionalInfo = `Selected Package: ${pkg.title}\nOption: ${opt.optionTitle}\nPrice: ${budgetDisplay}\nActivities: ${opt.activities}\n\n`;
    setFormData(prev => ({
      ...prev,
      travelType: pkg.title,
      destinations: [...new Set([...prev.destinations, ...destinationsArray])],
      budget: budgetDisplay,
      nights: nights || prev.nights,
      additionalInfo: additionalInfo + prev.additionalInfo,
    }));
    setTouchedFields(prev => ({ ...prev, travelType: true, budget: true, nights: true }));
  };

  const handleCircuitSelect = (circuit: string) => {
    setSelectedCircuit(circuit);
    setSelectedPackage(null);
    setSelectedOption(null);
    if (!slugParam) {
      setFormData(prev => ({ ...prev, travelType: "", budget: "", nights: "" }));
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    const firstOpt = pkg.options?.[0] || null;
    setSelectedOption(firstOpt);
    if (firstOpt) autoFillFromPackage(pkg, firstOpt);
  };

  const handleOptionSelect = (opt: Option) => {
    setSelectedOption(opt);
    if (selectedPackage) autoFillFromPackage(selectedPackage, opt);
  };

  // Form handlers (no `any`)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const fieldName = name as keyof FormDataType;

    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: "" }));
    }

    if (type === "checkbox") {
      if (Array.isArray(formData[fieldName])) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: checked
            ? [...(prev[fieldName] as string[]), value]
            : (prev[fieldName] as string[]).filter(v => v !== value),
        }));
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: checked }));
        if (fieldName === "agreeToInfo" || fieldName === "agreeToTerms") {
          const err = validateField(fieldName, checked);
          setFieldErrors(prev => ({ ...prev, [fieldName]: err }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone: phone || "" }));
    if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: "" }));
  };

  const handlePhoneBlur = () => {
    setTouchedFields(prev => ({ ...prev, phone: true }));
    const err = validateField("phone", formData.phone);
    setFieldErrors(prev => ({ ...prev, phone: err }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormDataType;
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const err = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: err }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", email: "", phone: "", travelType: "", tripEnhancements: [],
      accommodation: "", airportPickup: "", expectedDate: "", nights: "", budget: "", adults: "2",
      children: "0", destinations: [], additionalInfo: "", agreeToTerms: false, agreeToInfo: false,
    });
    setFieldErrors({}); setTouchedFields({}); setCurrentStep(1);
    setSelectedCircuit(""); setSelectedPackage(null); setSelectedOption(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s1 = validateStep(1, formData), s2 = validateStep(2, formData), s4 = validateStep(4, formData);
    const allErrors = { ...s1.errors, ...s2.errors, ...s4.errors };
    if (Object.keys(allErrors).length) {
      setFieldErrors(allErrors);
      const allTouched: Partial<Record<keyof FormDataType, boolean>> = {};
      Object.keys(formData).forEach(k => allTouched[k as keyof FormDataType] = true);
      setTouchedFields(allTouched);
      setError("Please fix the errors before submitting");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to create booking");

      playSuccessTone();
      setShowFlash(true);
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const { isValid, errors } = validateStep(currentStep, formData);
    if (!isValid) {
      setFieldErrors(errors);
      const stepFields: (keyof FormDataType)[] = currentStep === 1
        ? ["firstName", "lastName", "email", "phone"]
        : currentStep === 2
        ? ["travelType", "accommodation", "airportPickup", "expectedDate", "nights", "adults", "budget"]
        : [];
      const newTouched = { ...touchedFields };
      stepFields.forEach(f => newTouched[f] = true);
      setTouchedFields(newTouched);
      setError("Please fill in all required fields");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasError = (field: keyof FormDataType) => !!fieldErrors[field] && !!touchedFields[field];
  const getError = (field: keyof FormDataType) => fieldErrors[field] || "";

  if (loadingPackages) return <div className="min-h-screen flex items-center justify-center">Loading safari packages...</div>;

  const circuits = [...new Set(packages.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section – unchanged, same as original */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover transform scale-105">
            <source src="/images/HeroVideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium tracking-wide">Begin Your Journey</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            Book Your Safari Adventure
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Experience the magic of Africa with our bespoke travel experiences
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <div className="py-16 px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="relative flex justify-between items-center max-w-3xl mx-auto">
              {[
                { step: 1, title: "Personal Info", icon: User },
                { step: 2, title: "Choose Safari", icon: Compass },
                { step: 3, title: "Preferences", icon: Coffee },
                { step: 4, title: "Review", icon: Shield },
              ].map((item, idx) => (
                <div key={item.step} className="flex flex-col items-center flex-1 relative">
                  {idx < 3 && (
                    <div className={`absolute top-5 left-[calc(50%+1rem)] w-[calc(100%-2rem)] h-0.5 transition-all duration-500 ${
                      currentStep > item.step ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-gray-300"
                    }`} />
                  )}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                    currentStep >= item.step
                      ? "bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg transform scale-110 ring-4 ring-blue-100"
                      : "bg-gray-300 text-gray-500"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-medium mt-3 text-gray-600 hidden sm:block">{item.title}</div>
                  {currentStep >= item.step && (
                    <div className="absolute -bottom-6 text-xs text-orange-600 font-semibold whitespace-nowrap hidden md:block">
                      {currentStep === item.step ? "Current" : "Completed"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50 transition-all duration-300">
            {showFlash && (
              <div className="m-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 rounded-xl animate-slide-down shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div><p className="font-semibold text-lg">Booking Submitted!</p><p className="text-sm">We'll contact you within 24 hours.</p></div>
                </div>
              </div>
            )}
            {error && (
              <div className="m-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-md">
                <p className="font-semibold">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              {/* Step 1 – Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 text-blue-800 text-sm mb-4">
                      <User className="w-4 h-4" /> Step 1 of 4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Personal Information</h3>
                    <p className="text-gray-500 mt-2">Tell us who you are to begin your adventure</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-700" /> First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                          hasError("firstName") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="John"
                      />
                      {hasError("firstName") && <p className="text-red-500 text-sm mt-1">{getError("firstName")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-700" /> Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                          hasError("lastName") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="Doe"
                      />
                      {hasError("lastName") && <p className="text-red-500 text-sm mt-1">{getError("lastName")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-700" /> Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                          hasError("email") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="john@example.com"
                      />
                      {hasError("email") && <p className="text-red-500 text-sm mt-1">{getError("email")}</p>}
                    </div>
                    <div className="group">
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-700 dark:text-blue-400" /> Phone Number *
                        </label>
                        <div
                          className={`w-full rounded-xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400 ${
                            hasError("phone")
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500"
                          }`}
                        >
                          <PhoneInput
                            defaultCountry="tz"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
                            className="w-full [&_.react-international-phone-input-container]:border-0 [&_.react-international-phone-country-selector-button]:border-0 [&_.react-international-phone-country-selector-button]:bg-transparent [&_.react-international-phone-country-selector-button]:px-3 [&_.react-international-phone-country-selector-button]:hover:bg-gray-100 [&_.react-international-phone-country-selector-button]:dark:hover:bg-gray-700 [&_.react-international-phone-input]:border-0 [&_.react-international-phone-input]:outline-none [&_.react-international-phone-input]:bg-transparent [&_.react-international-phone-input]:py-4 [&_.react-international-phone-input]:px-3 [&_.react-international-phone-input]:w-full"
                          />
                        </div>
                        {hasError("phone") && <p className="text-red-500 text-sm mt-1">{getError("phone")}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 – Choose Safari (simplified to avoid duplication; the same as user's original) */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 text-blue-800 text-sm mb-4">
                      <Compass className="w-4 h-4" /> Step 2 of 4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Choose Your Safari</h3>
                    <p className="text-gray-500 mt-2">Select a circuit, then pick your dream package</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {circuits.map(circuit => (
                      <button
                        key={circuit}
                        type="button"
                        onClick={() => handleCircuitSelect(circuit)}
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedCircuit === circuit
                            ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md ring-2 ring-orange-200"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <div className="text-5xl mb-3">{circuitInfo[circuit]?.icon || "🌍"}</div>
                        <h4 className="font-bold text-xl">{circuit}</h4>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{circuitInfo[circuit]?.description || "Explore Tanzania's finest"}</p>
                      </button>
                    ))}
                  </div>

                  {selectedCircuit && (
                    <div className="mt-10">
                      <h4 className="text-xl font-semibold mb-5 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-orange-600" />
                        Available Packages in {selectedCircuit}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {packages.filter(p => p.category === selectedCircuit).map(pkg => (
                          <div
                            key={pkg._id}
                            onClick={() => handlePackageSelect(pkg)}
                            className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${
                              selectedPackage?._id === pkg._id
                                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 ring-2 ring-orange-200"
                                : "border-gray-200 bg-white hover:border-orange-300"
                            }`}
                          >
                            <div className="relative h-52 w-full bg-gray-200">
                              <Image src={pkg.cardImage} alt={pkg.title} fill className="object-cover" />
                              {selectedPackage?._id === pkg._id && (
                                <div className="absolute top-3 right-3 bg-orange-600 text-white rounded-full p-1.5 shadow-lg">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h5 className="font-bold text-xl">{pkg.title}</h5>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pkg.shortDescription}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-orange-600 font-bold text-lg">
                                  {pkg.options.length ? getOptionPriceDisplay(pkg.options[0]) : "Contact for price"}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                  {pkg.options.length} option{pkg.options.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPackage && selectedPackage.options.length > 1 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-inner">
                      <h4 className="font-semibold mb-4 text-gray-800">Choose your preferred option:</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedPackage.options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleOptionSelect(opt)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              selectedOption?.optionTitle === opt.optionTitle
                                ? "bg-orange-600 text-white shadow-md transform scale-105"
                                : "bg-white border border-gray-300 text-gray-700 hover:border-orange-400 hover:shadow"
                            }`}
                          >
                            {opt.optionTitle} – {getOptionPriceDisplay(opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPackage && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl mt-6 shadow-md">
                      <div className="flex items-center gap-2 text-blue-800 mb-3"><Info className="w-5 h-5" /> Selected package details</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold">Travel Type:</span> {formData.travelType}</div>
                        <div><span className="font-semibold">Budget:</span> {formData.budget}</div>
                        <div><span className="font-semibold">Nights:</span> {formData.nights || "To be confirmed"}</div>
                        <div><span className="font-semibold">Destinations:</span> {formData.destinations.join(", ")}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-blue-700" /> Accommodation Type *
                      </label>
                      <select
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 ${
                          hasError("accommodation") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select preferred category</option>
                        <option value="Luxury">⭐ Luxury (5-star lodges)</option>
                        <option value="Mid Range">✨ Mid Range (comfortable)</option>
                        <option value="Budget">🏕️ Budget (basic camping)</option>
                      </select>
                      {hasError("accommodation") && <p className="text-red-500 text-sm mt-1">{getError("accommodation")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-700" /> Airport Pickup *
                      </label>
                      <select
                        name="airportPickup"
                        value={formData.airportPickup}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 ${
                          hasError("airportPickup") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select your arrival airport</option>
                        <option value="Kilimanjaro (KIA)">🗻 Kilimanjaro (JRO)</option>
                        <option value="Dar es salaam (JNIA)">🏙️ Dar es Salaam (DAR)</option>
                        <option value="Zanzibar (ZNZ)">🏝️ Zanzibar (ZNZ)</option>
                      </select>
                      {hasError("airportPickup") && <p className="text-red-500 text-sm mt-1">{getError("airportPickup")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-700" /> Expected Start Date *
                      </label>
                      <input
                        type="date"
                        name="expectedDate"
                        value={formData.expectedDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 ${
                          hasError("expectedDate") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {hasError("expectedDate") && <p className="text-red-500 text-sm mt-1">{getError("expectedDate")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-700" /> Number of Nights *
                      </label>
                      <input
                        type="number"
                        name="nights"
                        value={formData.nights}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., 7"
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 ${
                          hasError("nights") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {hasError("nights") && <p className="text-red-500 text-sm mt-1">{getError("nights")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-700" /> Adults (18+) *
                      </label>
                      <select
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 ${
                          hasError("adults") ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                      >
                        {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} adult{i !== 0 ? "s" : ""}</option>)}
                      </select>
                      {hasError("adults") && <p className="text-red-500 text-sm mt-1">{getError("adults")}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-700" /> Children (under 12)
                      </label>
                      <select
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400"
                      >
                        {[...Array(8)].map((_, i) => <option key={i} value={i}>{i} child{i !== 1 ? "ren" : ""}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 – Preferences (unchanged) */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 text-blue-800 text-sm mb-4">
                      <Coffee className="w-4 h-4" /> Step 3 of 4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Your Preferences</h3>
                    <p className="text-gray-500 mt-2">Tell us how to make your safari extraordinary</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-orange-600" /> Trip Enhancements (select extra experiences)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Beach", "Boat Safari", "Bush Drive", "Chimps/Guerilla", "Night Game Drive", "Walking Safari", "Other"].map(enh => (
                        <label key={enh} className="flex items-center gap-3 p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group">
                          <input
                            type="checkbox"
                            name="tripEnhancements"
                            value={enh}
                            checked={formData.tripEnhancements.includes(enh)}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="text-gray-700 group-hover:text-orange-700 transition-colors">{enh}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" /> Additional Destinations (you can select more)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                      {["Arusha","Katavi","Lake Manyara","Mafia Island","Mahale","Mikumi","Nyerere","Ngorongoro Crater","Pemba","Ruaha","Serengeti","Tarangire","Zanzibar Beach","Other"].map(place => (
                        <label key={place} className="flex items-center gap-3 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            name="destinations"
                            value={place}
                            checked={formData.destinations.includes(place)}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{place}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-700" /> Additional Information
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-5 rounded-2xl border-2 border-gray-200 transition-all duration-200 shadow-sm group-hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
                      placeholder="Any special requests, dietary restrictions, or additional information?"
                    />
                  </div>
                </div>
              )}

              {/* Step 4 – Review (unchanged) */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 text-blue-800 text-sm mb-4">
                      <Shield className="w-4 h-4" /> Step 4 of 4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Review Your Booking</h3>
                    <p className="text-gray-500 mt-2">Please double-check your details before submitting</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-8 shadow-md border border-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><strong className="text-blue-800">📛 Name:</strong> {formData.firstName} {formData.lastName}</div>
                      <div><strong className="text-blue-800">📧 Email:</strong> {formData.email}</div>
                      <div><strong className="text-blue-800">📞 Phone:</strong> {formData.phone}</div>
                      <div><strong className="text-blue-800">🦁 Travel Type:</strong> {formData.travelType}</div>
                      <div><strong className="text-blue-800">🏨 Accommodation:</strong> {formData.accommodation}</div>
                      <div><strong className="text-blue-800">📅 Start Date:</strong> {formData.expectedDate}</div>
                      <div><strong className="text-blue-800">🌙 Nights:</strong> {formData.nights}</div>
                      <div><strong className="text-blue-800">👥 Adults:</strong> {formData.adults}</div>
                      <div><strong className="text-blue-800">🧸 Children:</strong> {formData.children}</div>
                      <div><strong className="text-blue-800">💰 Budget:</strong> {formData.budget}</div>
                      <div><strong className="text-blue-800">✈️ Airport:</strong> {formData.airportPickup}</div>
                      <div><strong className="text-blue-800">✨ Enhancements:</strong> {formData.tripEnhancements.join(", ") || "None"}</div>
                      <div className="md:col-span-2"><strong className="text-blue-800">📍 Destinations:</strong> {formData.destinations.join(", ")}</div>
                      {formData.additionalInfo && <div className="md:col-span-2"><strong className="text-blue-800">📝 Additional Info:</strong> {formData.additionalInfo}</div>}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <label className="flex items-start gap-3 p-5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        name="agreeToInfo"
                        checked={formData.agreeToInfo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span>I agree to be contacted for follow-up and additional information. *</span>
                    </label>
                    {hasError("agreeToInfo") && <p className="text-red-500 text-sm">{getError("agreeToInfo")}</p>}
                    <label className="flex items-start gap-3 p-5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span>I agree to the terms and conditions. *</span>
                    </label>
                    {hasError("agreeToTerms") && <p className="text-red-500 text-sm">{getError("agreeToTerms")}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12 pt-8 border-t-2 border-gray-200">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold flex items-center gap-2"
                  >
                    ← Previous
                  </button>
                )}
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold ml-auto flex items-center gap-2"
                  >
                    Next Step →
                  </button>
                )}
                {currentStep === 4 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-10 py-3.5 bg-gradient-to-r from-orange-700 to-orange-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold ml-auto flex items-center gap-3 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Booking <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <Shield className="w-12 h-12 text-blue-900" />
              <div><p className="font-bold text-gray-800">Secure Booking</p><p className="text-sm text-gray-500">Your data is encrypted and safe</p></div>
            </div>
            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <Award className="w-12 h-12 text-blue-900" />
              <div><p className="font-bold text-gray-800">Best Price Guarantee</p><p className="text-sm text-gray-500">No hidden fees, price match</p></div>
            </div>
            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <Star className="w-12 h-12 text-blue-900" />
              <div><p className="font-bold text-gray-800">5-Star Service</p><p className="text-sm text-gray-500">Expert travel planners ready for you</p></div>
            </div>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </div>
  );
}