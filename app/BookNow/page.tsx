// app/BookNow/page.tsx
"use client";
import { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Calendar, Users, Plane, Hotel, MapPin, Phone, Mail, User,
  Clock, Sparkles, Shield, Award, Star, CheckCircle, Info, Globe,
  Compass, Coffee, Heart, Briefcase, PawPrint, Trees, Waves, Moon,
  Baby, Wallet, FileText, AlertTriangle, Check, ArrowLeft, ArrowRight,
  Send,
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
  name?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  mainImage?: string;
  cardImage: string;
  priceType?: string;
  priceAmount?: number | null;
  priceTiers?: PriceTier[];
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

const steps: { step: number; title: string; icon: LucideIcon }[] = [
  { step: 1, title: "Personal Info", icon: User },
  { step: 2, title: "Choose Safari", icon: Compass },
  { step: 3, title: "Preferences", icon: Coffee },
  { step: 4, title: "Review", icon: Shield },
];

const circuitInfo: Record<string, { description: string; icon: LucideIcon }> = {
  "Northern Circuit": {
    description:
      "Serengeti, Ngorongoro Crater, Lake Manyara - the classic safari route, great for the Great Migration.",
    icon: PawPrint,
  },
  "Southern Circuit": {
    description:
      "Ruaha, Nyerere (Selous) - vast, remote wilderness, ideal for off-the-beaten-path adventures.",
    icon: Trees,
  },
  "Beach Vacation": {
    description: "Zanzibar, Mafia, Pemba - white sands, turquoise water, and Swahili culture.",
    icon: Waves,
  },
};

const getOptionPriceDisplay = (opt: Option): string => {
  if (opt.priceType === "fixed" && opt.priceAmount) {
    return `$${opt.priceAmount.toLocaleString()}`;
  } else if (opt.priceType === "tiered" && opt.priceTiers && opt.priceTiers.length) {
    const min = Math.min(...opt.priceTiers.map((t) => t.pricePerPerson));
    const max = Math.max(...opt.priceTiers.map((t) => t.pricePerPerson));
    return min === max ? `$${min.toLocaleString()}` : `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  return "Contact for price";
};

// ---------- Small presentational helpers ----------
const StepHeader = ({
  icon: Icon,
  step,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  step: number;
  title: string;
  subtitle: string;
}) => (
  <div className="text-center">
    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 rounded-full px-4 py-1.5 text-sm mb-4">
      <Icon className="w-4 h-4" /> Step {step} of 4
    </div>
    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 mt-2">{subtitle}</p>
  </div>
);

const SummaryRow = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-blue-700" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 font-medium break-words">{value}</p>
    </div>
  </div>
);

// ---------- Validation ----------
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
    case "expectedDate": {
      if (!stringVal) return "Select expected date";
      const selectedDate = new Date(stringVal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) return "Date cannot be in the past";
      return "";
    }
    case "nights": {
      if (!stringVal) return "Nights required";
      const nights = parseInt(stringVal);
      if (isNaN(nights) || nights < 1) return "Must be at least 1 night";
      if (nights > 365) return "Max 365 nights";
      return "";
    }
    case "adults": {
      if (!stringVal) return "Adults required";
      const adults = parseInt(stringVal);
      if (isNaN(adults) || adults < 1) return "At least 1 adult";
      if (adults > 50) return "Max 50 adults";
      return "";
    }
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

// Helper type for window audio
interface WindowWithAudio {
  AudioContext?: typeof AudioContext;
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

  const fieldClass = (hasError: boolean) =>
    `w-full p-4 rounded-2xl border-2 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
    }`;

  // Play success tone
  const playSuccessTone = () => {
    try {
      const win = window as WindowWithAudio;
      const AudioCtor = win.AudioContext || win.webkitAudioContext;
      if (!AudioCtor) return;
      const audioCtx = new AudioCtor();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.3;
      oscillator.type = "sine";
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.warn("Could not play success sound:", err);
    }
  };

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

  useEffect(() => {
    if (slugParam && packages.length > 0 && !selectedPackage) {
      const found = packages.find((p) => p.slug === slugParam);
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
    const nightsMatch: RegExpMatchArray | null = pkg.title.match(/(\d+)[-\s]*[Dd]ay/);
    const nights = nightsMatch ? nightsMatch[1] : "";
    let budgetDisplay = "";
    if (opt.priceType === "fixed" && opt.priceAmount) budgetDisplay = `$${opt.priceAmount.toLocaleString()} per person (fixed)`;
    else if (opt.priceType === "tiered" && opt.priceTiers?.length) {
      const min = Math.min(...opt.priceTiers.map((t) => t.pricePerPerson));
      const max = Math.max(...opt.priceTiers.map((t) => t.pricePerPerson));
      budgetDisplay = min === max ? `$${min.toLocaleString()}` : `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    setFormData((prev) => ({
      ...prev,
      travelType: `${pkg.title} - ${opt.optionTitle}`,
      budget: budgetDisplay || prev.budget,
      destinations: prev.destinations,
      nights: prev.nights || nights,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 4) {
      nextStep();
      return;
    }
    const { isValid, errors } = validateStep(4, formData);
    if (!isValid) {
      setFieldErrors(errors);
      setTouchedFields((p) => ({ ...p, agreeToInfo: true, agreeToTerms: true }));
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Failed to submit booking");
      }
      playSuccessTone();
      setShowFlash(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (name: keyof FormDataType, value: FieldValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const key = name as keyof FormDataType;
    if (type === "checkbox") {
      if (Array.isArray(formData[key])) {
        const arr = formData[key] as string[];
        set(key, checked ? [...arr, value] : arr.filter((v) => v !== value));
      } else {
        set(key, checked);
        if (key === "agreeToInfo" || key === "agreeToTerms") {
          setFieldErrors((p) => ({ ...p, [key]: validateField(key, checked) }));
        }
      }
    } else {
      set(key, value);
      if (touchedFields[key]) {
        setFieldErrors((p) => ({ ...p, [key]: validateField(key, value) }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormDataType;
    setTouchedFields((p) => ({ ...p, [key]: true }));
    setFieldErrors((p) => ({ ...p, [key]: validateField(key, value) }));
  };

  const handlePhoneChange = (phone: string) => {
    set("phone", phone || "");
    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
  };

  const handlePhoneBlur = () => {
    setTouchedFields((p) => ({ ...p, phone: true }));
    setFieldErrors((p) => ({ ...p, phone: validateField("phone", formData.phone) }));
  };

  const nextStep = () => {
    const { isValid, errors } = validateStep(currentStep, formData);
    if (!isValid) {
      setFieldErrors((p) => ({ ...p, ...errors }));
      const fields = Object.keys(errors) as (keyof FormDataType)[];
      setTouchedFields((p) => ({ ...p, ...Object.fromEntries(fields.map((f) => [f, true])) }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasError = (key: keyof FormDataType) => Boolean(fieldErrors[key] && touchedFields[key]);

  if (loadingPackages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading safari packages...</p>
        </div>
      </div>
    );
  }

  const circuits = Array.from(new Set(packages.map((p) => p.category)));
  const hotels = ["Luxury (5-star lodges)", "Mid Range (comfortable)", "Budget (basic camping)"];
  const airports = ["Kilimanjaro (JRO)", "Dar es Salaam (DAR)", "Zanzibar (ZNZ)"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative h-[62vh] min-h-[460px] flex items-center justify-center text-center text-white overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20 text-sm font-medium tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Begin Your Journey
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Book Your Safari Adventure
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-light text-white/85">
            Experience the magic of Africa with our bespoke travel experiences
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Stepper */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 px-4 py-5 mb-8">
            <div className="flex items-start justify-center">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const done = currentStep > s.step;
                const active = currentStep === s.step;
                return (
                  <Fragment key={s.step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          active
                            ? "bg-blue-900 border-blue-900 text-white shadow-md scale-110"
                            : done
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium hidden sm:block ${
                          active ? "text-blue-900" : done ? "text-orange-600" : "text-gray-400"
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 max-w-[5rem] mt-[21px] mx-2 transition-colors duration-300 ${
                          currentStep > s.step ? "bg-orange-400" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {showFlash && (
              <div className="m-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Booking Submitted!</p>
                  <p className="text-sm">We&apos;ll contact you within 24 hours.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <StepHeader
                    icon={User}
                    step={1}
                    title="Personal Information"
                    subtitle="Let&apos;s start with your details"
                  />
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
                        className={fieldClass(hasError("firstName"))}
                        placeholder="John"
                      />
                      {hasError("firstName") && <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>}
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
                        className={fieldClass(hasError("lastName"))}
                        placeholder="Doe"
                      />
                      {hasError("lastName") && <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>}
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
                        className={fieldClass(hasError("email"))}
                        placeholder="john@example.com"
                      />
                      {hasError("email") && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-700" /> Phone *
                      </label>
                      <div className={`rounded-2xl border-2 overflow-hidden ${hasError("phone") ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-blue-500"}`}>
                        <PhoneInput
                          defaultCountry="tz"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          inputClassName="!w-full !p-4 !text-base !border-0 !bg-transparent focus:!outline-none"
                          className="!w-full"
                        />
                      </div>
                      {hasError("phone") && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <StepHeader
                    icon={Compass}
                    step={2}
                    title="Choose Your Safari"
                    subtitle="Select a circuit, then pick your dream package"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {circuits.map((circuit) => {
                      const info = circuitInfo[circuit];
                      const Icon = info?.icon || Globe;
                      const active = selectedCircuit === circuit;
                      return (
                        <button
                          key={circuit}
                          type="button"
                          onClick={() => {
                            setSelectedCircuit(circuit);
                            setSelectedPackage(null);
                            setSelectedOption(null);
                            set("travelType", "");
                          }}
                          className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                            active
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${active ? "bg-orange-600 text-white" : "bg-blue-50 text-blue-900"}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-lg text-gray-900">{circuit}</h4>
                          <p className="text-sm text-gray-600 mt-2">{info?.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  {selectedCircuit && (
                    <div className="mt-4">
                      <h4 className="text-xl font-semibold mb-5 flex items-center gap-2 text-gray-900">
                        <Globe className="w-5 h-5 text-orange-600" />
                        Available Packages in {selectedCircuit}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {packages
                          .filter((p) => p.category === selectedCircuit)
                          .map((pkg) => (
                            <div
                              key={pkg._id}
                              onClick={() => {
                                setSelectedPackage(pkg);
                                if (pkg.options.length) {
                                  setSelectedOption(pkg.options[0]);
                                  autoFillFromPackage(pkg, pkg.options[0]);
                                }
                              }}
                              className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                                selectedPackage?._id === pkg._id
                                  ? "border-orange-500 bg-orange-50 shadow-md"
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
                                <h5 className="font-bold text-xl text-gray-900">{pkg.title}</h5>
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
                    <div className="mt-2 p-6 bg-slate-50 rounded-2xl border border-gray-100">
                      <h4 className="font-semibold mb-4 text-gray-800">Choose your preferred option:</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedPackage.options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedOption(opt);
                              autoFillFromPackage(selectedPackage, opt);
                            }}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              selectedOption?.optionTitle === opt.optionTitle
                                ? "bg-orange-600 text-white shadow-md"
                                : "bg-white border border-gray-300 text-gray-700 hover:border-orange-400"
                            }`}
                          >
                            {opt.optionTitle} - {getOptionPriceDisplay(opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPackage && (
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-800 mb-3">
                        <Info className="w-5 h-5" /> Selected package details
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div><span className="font-semibold text-gray-900">Travel Type:</span> {formData.travelType}</div>
                        <div><span className="font-semibold text-gray-900">Budget:</span> {formData.budget}</div>
                        <div><span className="font-semibold text-gray-900">Nights:</span> {formData.nights || "To be confirmed"}</div>
                        <div><span className="font-semibold text-gray-900">Destinations:</span> {formData.destinations.join(", ") || "-"}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-blue-700" /> Accommodation Type *
                      </label>
                      <select name="accommodation" value={formData.accommodation} onChange={handleChange} onBlur={handleBlur} className={fieldClass(hasError("accommodation"))}>
                        <option value="">Select preferred category</option>
                        {hotels.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      {hasError("accommodation") && <p className="text-red-500 text-sm mt-1">{fieldErrors.accommodation}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-700" /> Airport Pickup *
                      </label>
                      <select name="airportPickup" value={formData.airportPickup} onChange={handleChange} onBlur={handleBlur} className={fieldClass(hasError("airportPickup"))}>
                        <option value="">Select arrival airport</option>
                        {airports.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {hasError("airportPickup") && <p className="text-red-500 text-sm mt-1">{fieldErrors.airportPickup}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-700" /> Expected Start Date *
                      </label>
                      <input type="date" name="expectedDate" value={formData.expectedDate} onChange={handleChange} onBlur={handleBlur} className={fieldClass(hasError("expectedDate"))} />
                      {hasError("expectedDate") && <p className="text-red-500 text-sm mt-1">{fieldErrors.expectedDate}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-700" /> Number of Nights *
                      </label>
                      <input type="number" name="nights" value={formData.nights} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., 7" className={fieldClass(hasError("nights"))} />
                      {hasError("nights") && <p className="text-red-500 text-sm mt-1">{fieldErrors.nights}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-700" /> Adults (18+) *
                      </label>
                      <select name="adults" value={formData.adults} onChange={handleChange} onBlur={handleBlur} className={fieldClass(hasError("adults"))}>
                        {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} adult{i !== 0 ? "s" : ""}</option>)}
                      </select>
                      {hasError("adults") && <p className="text-red-500 text-sm mt-1">{fieldErrors.adults}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-700" /> Children (under 12)
                      </label>
                      <select name="children" value={formData.children} onChange={handleChange} className={fieldClass(false)}>
                        {[...Array(8)].map((_, i) => <option key={i} value={i}>{i} child{i !== 1 ? "ren" : ""}</option>)}
                      </select>
                    </div>
                    <div className="group md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-blue-700" /> Estimated Budget (USD) *
                      </label>
                      <input type="text" name="budget" value={formData.budget} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., $2,500 per person" className={fieldClass(hasError("budget"))} />
                      {hasError("budget") && <p className="text-red-500 text-sm mt-1">{fieldErrors.budget}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <StepHeader
                    icon={Coffee}
                    step={3}
                    title="Your Preferences"
                    subtitle="Tell us how to make your safari extraordinary"
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" /> Trip Enhancements (select extra experiences)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Beach", "Boat Safari", "Bush Drive", "Chimps/Guerilla", "Night Game Drive", "Walking Safari", "Other"].map((enh) => (
                        <label key={enh} className="flex items-center gap-3 p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            name="tripEnhancements"
                            value={enh}
                            checked={formData.tripEnhancements.includes(enh)}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="text-gray-700">{enh}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" /> Additional Destinations (you can select more)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                      {["Arusha", "Katavi", "Lake Manyara", "Mafia Island", "Mahale", "Mikumi", "Nyerere", "Ngorongoro Crater", "Pemba", "Ruaha", "Serengeti", "Tarangire", "Zanzibar Beach", "Other"].map((place) => (
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
                      className={fieldClass(false)}
                      placeholder="Any special requests, dietary restrictions, or additional information?"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fade-in">
                  <StepHeader
                    icon={Shield}
                    step={4}
                    title="Review Your Booking"
                    subtitle="Please double-check your details before submitting"
                  />
                  <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      <SummaryRow icon={User} label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                      <SummaryRow icon={Mail} label="Email" value={formData.email} />
                      <SummaryRow icon={Phone} label="Phone" value={formData.phone} />
                      <SummaryRow icon={Compass} label="Travel Type" value={formData.travelType} />
                      <SummaryRow icon={Calendar} label="Start Date" value={formData.expectedDate} />
                      <SummaryRow icon={Moon} label="Nights" value={formData.nights} />
                      <SummaryRow icon={Users} label="Adults" value={formData.adults} />
                      <SummaryRow icon={Baby} label="Children" value={formData.children} />
                      <SummaryRow icon={Hotel} label="Accommodation" value={formData.accommodation} />
                      <SummaryRow icon={Plane} label="Airport" value={formData.airportPickup} />
                      <SummaryRow icon={Wallet} label="Budget" value={formData.budget} />
                      <SummaryRow icon={Sparkles} label="Enhancements" value={formData.tripEnhancements.join(", ") || "None"} />
                      <SummaryRow icon={MapPin} label="Destinations" value={formData.destinations.join(", ") || "-"} className="sm:col-span-2" />
                      {formData.additionalInfo && (
                        <SummaryRow icon={FileText} label="Additional Info" value={formData.additionalInfo} className="sm:col-span-2" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-blue-200 transition">
                      <input type="checkbox" name="agreeToInfo" checked={formData.agreeToInfo} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-gray-700">I agree to be contacted about my booking.</span>
                    </label>
                    {hasError("agreeToInfo") && <p className="text-red-500 text-sm">{fieldErrors.agreeToInfo}</p>}
                    <label className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-blue-200 transition">
                      <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-gray-700">I agree to the terms and conditions. *</span>
                    </label>
                    {hasError("agreeToTerms") && <p className="text-red-500 text-sm mt-1">{fieldErrors.agreeToTerms}</p>}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-100">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition font-semibold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                ) : (
                  <span />
                )}
                {currentStep < 4 ? (
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-blue-900 text-white rounded-xl shadow-md hover:bg-blue-800 transition font-semibold flex items-center gap-2 ml-auto">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-orange-700 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition font-semibold flex items-center gap-3 ml-auto ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Booking <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust badges */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Secure Booking", text: "Your data is encrypted and safe" },
              { icon: Award, title: "Best Price Guarantee", text: "No hidden fees, price match" },
              { icon: Star, title: "5-Star Service", text: "Expert travel planners ready for you" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{title}</p>
                  <p className="text-sm text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </div>
  );
}
