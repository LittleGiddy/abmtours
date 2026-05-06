// app/admin/packages/create/page.tsx
"use client";
import { useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronDown, ChevronUp, Plus, Trash2, Upload, Image as ImageIcon, 
  Eye, CheckCircle, Info, Briefcase, Settings, ArrowLeft,
} from "lucide-react";

// ----------------------------- Types -----------------------------
interface PriceTier {
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
}

interface ItineraryBlock {
  time: string;
  description: string;
  activities: string[];
}

interface ItineraryDay {
  day: number;
  title: string;
  blocks: ItineraryBlock[];
  meals: string[];
  overnight: string;
}

interface Accommodation {
  title: string;
  description: string;
  images: string[];
}

interface Option {
  optionTitle: string;
  description: string;
  activities: string;
  itineraryDays: ItineraryDay[];
  mainImage: string;
  accommodation: Accommodation;
  priceType: "fixed" | "tiered" | "contact";
  priceAmount: number | null;
  priceTiers: PriceTier[];
  showMoreContent: string;
}

type Category = "Northern Circuit" | "Southern Circuit" | "Beach Vacation";

// ----------------------------- Section Component Props -----------------------------
interface SectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

// ----------------------------- Main Component -----------------------------
export default function CreatePackage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState<number[]>([0]);

  type FormDataType = {
    title: string;
    category: Category;
    shortDescription: string;
    overview: string;
    highlights: string[];
    arrivalText: string;
    quickInfo: string[];
    mapImage: string;
    includedList: string[];
    excludedList: string[];
    options: Option[];
  };

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    category: "Northern Circuit",
    shortDescription: "",
    overview: "",
    highlights: [],
    arrivalText: "",
    quickInfo: [],
    mapImage: "",
    includedList: [],
    excludedList: [],
    options: [],
  });

  const [images, setImages] = useState({
    cardImage: "",
    heroImage: "",
  });

  // Input states
  const [highlightInput, setHighlightInput] = useState("");
  const [quickInfoInput, setQuickInfoInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");

  // Refs for file inputs
  const cardImageRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);
  const mapImageRef = useRef<HTMLInputElement>(null);

  // ----------------------------- Image upload helper -----------------------------
  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
    if (!res.ok) throw new Error("Upload failed");
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  // ----------------------------- Basic Image Handlers -----------------------------
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cardImage" | "heroImage" | "mapImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      if (field === "cardImage" || field === "heroImage") {
        setImages((prev) => ({ ...prev, [field]: url }));
      } else if (field === "mapImage") {
        setFormData((prev) => ({ ...prev, mapImage: url }));
      }
    } catch {
      alert("Failed to upload image");
    }
  };

  // ----------------------------- List Helpers -----------------------------
  const addToList = (
    list: string[],
    setList: (newList: string[]) => void,
    input: string,
    setInput: (val: string) => void
  ) => {
    if (input.trim()) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };
  const removeFromList = (list: string[], setList: (newList: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  // Highlights
  const addHighlight = () =>
    addToList(formData.highlights, (newList) => setFormData({ ...formData, highlights: newList }), highlightInput, setHighlightInput);
  const removeHighlight = (idx: number) =>
    removeFromList(formData.highlights, (newList) => setFormData({ ...formData, highlights: newList }), idx);

  // Quick Info
  const addQuickInfo = () =>
    addToList(formData.quickInfo, (newList) => setFormData({ ...formData, quickInfo: newList }), quickInfoInput, setQuickInfoInput);
  const removeQuickInfo = (idx: number) =>
    removeFromList(formData.quickInfo, (newList) => setFormData({ ...formData, quickInfo: newList }), idx);

  // Included
  const addIncluded = () =>
    addToList(formData.includedList, (newList) => setFormData({ ...formData, includedList: newList }), includedInput, setIncludedInput);
  const removeIncluded = (idx: number) =>
    removeFromList(formData.includedList, (newList) => setFormData({ ...formData, includedList: newList }), idx);

  // Excluded
  const addExcluded = () =>
    addToList(formData.excludedList, (newList) => setFormData({ ...formData, excludedList: newList }), excludedInput, setExcludedInput);
  const removeExcluded = (idx: number) =>
    removeFromList(formData.excludedList, (newList) => setFormData({ ...formData, excludedList: newList }), idx);

  // ----------------------------- Options Management -----------------------------
  const addOption = () => {
    const newOption: Option = {
      optionTitle: "",
      description: "",
      activities: "",
      itineraryDays: [],
      mainImage: "",
      accommodation: { title: "", description: "", images: [] },
      priceType: "fixed",
      priceAmount: null,
      priceTiers: [],
      showMoreContent: "",
    };
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    setExpandedOptions((prev) => [...prev, prev.length]);
  };

  const removeOption = (index: number) => {
    if (window.confirm("Are you sure you want to remove this option?")) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
      setExpandedOptions(expandedOptions.filter((i) => i !== index).map((_, idx) => idx));
    }
  };

  // Generic option updater – typesafe
  const updateOption = <K extends keyof Option>(index: number, field: K, value: Option[K]) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setFormData({ ...formData, options: updatedOptions });
  };

  const uploadOptionImage = async (index: number, file: File, isMainImage: boolean) => {
    try {
      const url = await uploadImage(file);
      if (isMainImage) {
        updateOption(index, "mainImage", url);
      } else {
        const currentAccommodation = formData.options[index].accommodation;
        updateOption(index, "accommodation", {
          ...currentAccommodation,
          images: [...currentAccommodation.images, url],
        });
      }
    } catch {
      alert("Failed to upload image");
    }
  };

  const removeAccommodationImage = (optionIndex: number, imgIndex: number) => {
    const opt = formData.options[optionIndex];
    const newImages = opt.accommodation.images.filter((_, i) => i !== imgIndex);
    updateOption(optionIndex, "accommodation", { ...opt.accommodation, images: newImages });
  };

  // ----------------------------- Itinerary (with blocks) -----------------------------
  const addItineraryDay = (optionIndex: number) => {
    const opt = formData.options[optionIndex];
    const newDay: ItineraryDay = {
      day: opt.itineraryDays.length + 1,
      title: "",
      blocks: [],
      meals: [],
      overnight: "",
    };
    updateOption(optionIndex, "itineraryDays", [...opt.itineraryDays, newDay]);
  };

  const updateItineraryDay = (
    optionIndex: number,
    dayIndex: number,
    field: keyof ItineraryDay,
    value: string | string[] | ItineraryBlock[]
  ) => {
    const opt = formData.options[optionIndex];
    const updatedDays = [...opt.itineraryDays];
    if (field === "meals" && typeof value === "string") {
      updatedDays[dayIndex].meals = value.split(",").map((s) => s.trim());
    } else if (field === "blocks" && Array.isArray(value)) {
      updatedDays[dayIndex].blocks = value as ItineraryBlock[];
    } else if (field === "title" && typeof value === "string") {
      updatedDays[dayIndex].title = value;
    } else if (field === "overnight" && typeof value === "string") {
      updatedDays[dayIndex].overnight = value;
    }
    updateOption(optionIndex, "itineraryDays", updatedDays);
  };

  const removeItineraryDay = (optionIndex: number, dayIndex: number) => {
    const opt = formData.options[optionIndex];
    const updatedDays = opt.itineraryDays.filter((_, i) => i !== dayIndex);
    updatedDays.forEach((day, idx) => (day.day = idx + 1));
    updateOption(optionIndex, "itineraryDays", updatedDays);
  };

  // Blocks within a day
  const addBlock = (optionIndex: number, dayIndex: number) => {
    const opt = formData.options[optionIndex];
    const day = opt.itineraryDays[dayIndex];
    const newBlock: ItineraryBlock = {
      time: "",
      description: "",
      activities: [],
    };
    const updatedBlocks = [...day.blocks, newBlock];
    updateOption(optionIndex, "itineraryDays", {
      ...opt.itineraryDays,
      [dayIndex]: { ...day, blocks: updatedBlocks },
    } as any);
    // Using updateItineraryDay for blocks is simpler:
    // updateItineraryDay(optionIndex, dayIndex, "blocks", updatedBlocks);
  };
  // The above function is correct; we'll use the typed helper.

  // Let's redefine addBlock using updateItineraryDay:
  const addBlockTyped = (optionIndex: number, dayIndex: number) => {
    const opt = formData.options[optionIndex];
    const day = opt.itineraryDays[dayIndex];
    const newBlock: ItineraryBlock = { time: "", description: "", activities: [] };
    const updatedBlocks = [...day.blocks, newBlock];
    updateItineraryDay(optionIndex, dayIndex, "blocks", updatedBlocks);
  };

  const updateBlock = (
    optionIndex: number,
    dayIndex: number,
    blockIndex: number,
    field: keyof ItineraryBlock,
    value: string | string[]
  ) => {
    const opt = formData.options[optionIndex];
    const updatedBlocks = [...opt.itineraryDays[dayIndex].blocks];
    if (field === "activities" && typeof value === "string") {
      updatedBlocks[blockIndex].activities = value.split(",").map((s) => s.trim());
    } else if (field === "time" && typeof value === "string") {
      updatedBlocks[blockIndex].time = value;
    } else if (field === "description" && typeof value === "string") {
      updatedBlocks[blockIndex].description = value;
    }
    updateItineraryDay(optionIndex, dayIndex, "blocks", updatedBlocks);
  };

  const removeBlock = (optionIndex: number, dayIndex: number, blockIndex: number) => {
    const opt = formData.options[optionIndex];
    const updatedBlocks = opt.itineraryDays[dayIndex].blocks.filter((_, i) => i !== blockIndex);
    updateItineraryDay(optionIndex, dayIndex, "blocks", updatedBlocks);
  };

  // ----------------------------- Price Tiers Management -----------------------------
  const addPriceTier = (optionIndex: number) => {
    const opt = formData.options[optionIndex];
    const newTiers = [...opt.priceTiers, { minPax: 1, maxPax: 1, pricePerPerson: 0 }];
    updateOption(optionIndex, "priceTiers", newTiers);
  };

  const updatePriceTier = (optionIndex: number, tierIndex: number, field: keyof PriceTier, value: number) => {
    const opt = formData.options[optionIndex];
    const updatedTiers = [...opt.priceTiers];
    updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], [field]: value };
    updateOption(optionIndex, "priceTiers", updatedTiers);
  };

  const removePriceTier = (optionIndex: number, tierIndex: number) => {
    const opt = formData.options[optionIndex];
    const updatedTiers = opt.priceTiers.filter((_, i) => i !== tierIndex);
    updateOption(optionIndex, "priceTiers", updatedTiers);
  };

  const toggleOptionExpand = (idx: number) => {
    if (expandedOptions.includes(idx)) {
      setExpandedOptions(expandedOptions.filter((i) => i !== idx));
    } else {
      setExpandedOptions([...expandedOptions, idx]);
    }
  };

  // ----------------------------- Submit -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const packageData = {
      ...formData,
      ...images,
      slug,
    };
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });
      if (res.ok) {
        router.push("/admin/packages");
      } else {
        const error = (await res.json()) as { error: string };
        alert(error.error || "Failed to create package");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------- Preview Modal -----------------------------
  const PreviewModal = () => {
    const previewData = { ...formData, ...images };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 overflow-y-auto">
        <div className="bg-white max-w-4xl mx-auto my-8 rounded-lg max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Preview: {previewData.title}</h2>
            <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <Image
                src={previewData.heroImage || "/placeholder.jpg"}
                alt="Hero"
                width={800}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{previewData.title}</h1>
            <p className="mb-4">{previewData.overview}</p>
            <h2 className="text-2xl font-bold mt-6 mb-2">Highlights</h2>
            <ul className="list-disc pl-5 mb-4">
              {previewData.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            {previewData.mapImage && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Map</h2>
                <Image src={previewData.mapImage} alt="Map" width={600} height={300} className="rounded" />
              </div>
            )}
            {previewData.options.map((opt, idx) => (
              <div key={idx} className="border-t pt-4 mt-4">
                <h3 className="text-xl font-bold">{opt.optionTitle}</h3>
                <p>{opt.description}</p>
                <p><strong>Activities:</strong> {opt.activities}</p>
                <h4 className="font-semibold mt-2">Itinerary</h4>
                {opt.itineraryDays.map((day, dIdx) => (
                  <div key={dIdx} className="ml-4 mb-3">
                    <strong>Day {day.day}: {day.title}</strong>
                    {day.blocks.map((block, bIdx) => (
                      <div key={bIdx} className="ml-4 mt-1">
                        <em>{block.time}</em>
                        <p>{block.description}</p>
                        {block.activities.length > 0 && <p>Activities: {block.activities.join(", ")}</p>}
                      </div>
                    ))}
                    {day.meals.length > 0 && <p>Meals: {day.meals.join(", ")}</p>}
                    {day.overnight && <p>Overnight: {day.overnight}</p>}
                  </div>
                ))}
                <h4 className="font-semibold mt-2">Accommodation</h4>
                <p><strong>{opt.accommodation.title}</strong></p>
                <p>{opt.accommodation.description}</p>
                <div className="flex gap-2 mt-1">
                  {opt.accommodation.images.map((img, iidx) => (
                    <div key={iidx} className="relative h-20 w-20">
                      <Image src={img} alt="Acc" fill className="object-cover rounded" />
                    </div>
                  ))}
                </div>
                {opt.priceType === "fixed" && opt.priceAmount && (
                  <div className="text-green-700 font-bold text-xl">${opt.priceAmount.toLocaleString()} USD</div>
                )}
                {opt.priceType === "tiered" && opt.priceTiers.length > 0 && (
                  <div className="text-green-700 font-semibold">
                    Prices per person:
                    <ul className="list-disc ml-5">
                      {opt.priceTiers.map((tier, ti) => (
                        <li key={ti}>
                          {tier.minPax}-{tier.maxPax} pax: ${tier.pricePerPerson.toLocaleString()} USD
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {opt.priceType === "contact" && <div className="text-orange-600 font-semibold">Contact for price</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Section component with typed props
  const Section = ({ title, icon, children, defaultOpen = true }: SectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="bg-gray-50 rounded-xl border mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isOpen && <div className="p-5 border-t">{children}</div>}
      </div>
    );
  };

  // Use addBlockTyped in the render
  const addBlock = addBlockTyped; // alias

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Safari Package</h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Section title="Basic Information" icon={<Info className="w-5 h-5 text-blue-600" />} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  <option value="Northern Circuit">Northern Circuit</option>
                  <option value="Southern Circuit">Southern Circuit</option>
                  <option value="Beach Vacation">Beach Vacation</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  className="w-full p-2.5 border rounded-lg"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* Images Section */}
          <Section title="Images" icon={<ImageIcon className="w-5 h-5 text-blue-600" />} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Card Image", field: "cardImage" as const, ref: cardImageRef, current: images.cardImage, required: true },
                { label: "Hero Image", field: "heroImage" as const, ref: heroImageRef, current: images.heroImage, required: true },
                { label: "Map Image", field: "mapImage" as const, ref: mapImageRef, current: formData.mapImage, required: false },
              ].map((img) => (
                <div key={img.field} className="border rounded-lg p-4 bg-white">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {img.label} {img.required && "*"}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => img.ref.current?.click()}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" /> Upload
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={img.ref}
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, img.field)}
                    />
                  </div>
                  {img.current && (
                    <div className="relative mt-3 rounded-lg overflow-hidden border h-32">
                      <Image src={img.current} alt={img.label} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          if (img.field === "cardImage" || img.field === "heroImage") {
                            setImages((prev) => ({ ...prev, [img.field]: "" }));
                          } else {
                            setFormData((prev) => ({ ...prev, mapImage: "" }));
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Content Section */}
          <Section title="Content" icon={<Settings className="w-5 h-5 text-blue-600" />} defaultOpen>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview *</label>
                <textarea required rows={4} className="w-full p-2.5 border rounded-lg" value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" className="flex-1 p-2 border rounded-lg" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Enter highlight" />
                  <button type="button" onClick={addHighlight} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((h, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {h}
                      <button type="button" onClick={() => removeHighlight(i)} className="text-red-600 hover:text-red-800">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Text *</label>
                <textarea required rows={3} className="w-full p-2.5 border rounded-lg" value={formData.arrivalText} onChange={(e) => setFormData({ ...formData, arrivalText: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quick Information</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" className="flex-1 p-2 border rounded-lg" value={quickInfoInput} onChange={(e) => setQuickInfoInput(e.target.value)} placeholder="e.g., Best Time: June-Oct" />
                  <button type="button" onClick={addQuickInfo} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.quickInfo.map((q, i) => (
                    <span key={i} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {q}
                      <button type="button" onClick={() => removeQuickInfo(i)} className="text-red-600 hover:text-red-800">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Inclusions */}
          <Section title="Inclusions & Exclusions" icon={<CheckCircle className="w-5 h-5 text-blue-600" />} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">✓ What&apos;s Included</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" className="flex-1 p-2 border rounded-lg" value={includedInput} onChange={(e) => setIncludedInput(e.target.value)} placeholder="e.g., Park fees" />
                  <button type="button" onClick={addIncluded} className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700">Add</button>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.includedList.map((item, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeIncluded(i)} className="text-red-500 text-sm">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">✗ What&apos;s Excluded</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" className="flex-1 p-2 border rounded-lg" value={excludedInput} onChange={(e) => setExcludedInput(e.target.value)} placeholder="e.g., International flights" />
                  <button type="button" onClick={addExcluded} className="bg-red-600 text-white px-4 rounded-lg hover:bg-red-700">Add</button>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.excludedList.map((item, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeExcluded(i)} className="text-red-500 text-sm">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Tour Options */}
          <div className="bg-gray-50 rounded-xl border">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Tour Options
              </h2>
              <button type="button" onClick={addOption} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Option
              </button>
            </div>
            <div className="p-5 space-y-6">
              {formData.options.length === 0 && (
                <div className="text-center text-gray-500 py-8">No options added yet. Click &quot;Add Option&quot; to start.</div>
              )}
              {formData.options.map((opt, idx) => (
                <div key={idx} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleOptionExpand(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-800">Option {idx + 1}</span>
                      <span className="text-sm text-gray-500">{opt.optionTitle || "Untitled"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeOption(idx); }}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedOptions.includes(idx) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                  {expandedOptions.includes(idx) && (
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Option Title *</label>
                          <input type="text" required className="w-full p-2 border rounded-lg" value={opt.optionTitle} onChange={(e) => updateOption(idx, "optionTitle", e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Activities (short) *</label>
                          <input type="text" required className="w-full p-2 border rounded-lg" value={opt.activities} onChange={(e) => updateOption(idx, "activities", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Description *</label>
                          <textarea required rows={2} className="w-full p-2 border rounded-lg" value={opt.description} onChange={(e) => updateOption(idx, "description", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Main Image *</label>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => document.getElementById(`mainImage-${idx}`)?.click()} className="bg-gray-100 hover:bg-gray-200 border-2 border-dashed rounded-lg p-2 text-sm flex items-center gap-1">
                              <Upload className="w-4 h-4" /> Upload
                            </button>
                            <input id={`mainImage-${idx}`} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadOptionImage(idx, f, true); }} />
                          </div>
                          {opt.mainImage && <div className="relative h-32 w-48 mt-2 rounded-lg overflow-hidden border"><Image src={opt.mainImage} alt="main" fill className="object-cover" /></div>}
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Accommodation Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div><label className="text-sm">Accommodation Title</label><input type="text" className="w-full p-2 border rounded-lg" value={opt.accommodation.title} onChange={(e) => updateOption(idx, "accommodation", { ...opt.accommodation, title: e.target.value })} /></div>
                          <div className="md:col-span-2"><label className="text-sm">Description</label><textarea rows={2} className="w-full p-2 border rounded-lg" value={opt.accommodation.description} onChange={(e) => updateOption(idx, "accommodation", { ...opt.accommodation, description: e.target.value })} /></div>
                        </div>
                        <div>
                          <label className="text-sm">Accommodation Images</label>
                          <div className="flex items-center gap-2 mt-1">
                            <button type="button" onClick={() => document.getElementById(`accImages-${idx}`)?.click()} className="bg-gray-100 hover:bg-gray-200 border rounded-lg p-2 text-sm flex items-center gap-1">
                              <Upload className="w-4 h-4" /> Add Images
                            </button>
                            <input id={`accImages-${idx}`} type="file" accept="image/*" multiple className="hidden" onChange={async (e) => { const files = Array.from(e.target.files || []); for (const file of files) await uploadOptionImage(idx, file, false); }} />
                          </div>
                          <div className="grid grid-cols-4 gap-3 mt-3">
                            {opt.accommodation.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative h-24 rounded-lg overflow-hidden border">
                                <Image src={img} alt="acc" fill className="object-cover" />
                                <button type="button" onClick={() => removeAccommodationImage(idx, imgIdx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Itinerary Days */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">Itinerary Days</h4>
                          <button type="button" onClick={() => addItineraryDay(idx)} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">+ Add Day</button>
                        </div>
                        {opt.itineraryDays.map((day, dIdx) => (
                          <div key={dIdx} className="border rounded-lg p-3 mb-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <strong>Day {day.day}</strong>
                              <button type="button" onClick={() => removeItineraryDay(idx, dIdx)} className="text-red-500 text-sm">Remove Day</button>
                            </div>
                            <input type="text" placeholder="Day Title" className="w-full p-2 border rounded mb-2" value={day.title} onChange={(e) => updateItineraryDay(idx, dIdx, "title", e.target.value)} />
                            <div className="ml-4 mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Time Blocks</span>
                                <button type="button" onClick={() => addBlock(idx, dIdx)} className="text-xs bg-gray-300 px-2 py-1 rounded">+ Add Block</button>
                              </div>
                              {day.blocks.map((block, bIdx) => (
                                <div key={bIdx} className="border-l-2 border-indigo-300 pl-3 mb-2">
                                  <div className="flex justify-between">
                                    <input type="text" placeholder="Time (Morning/Afternoon/Evening)" className="w-full p-1 border rounded text-sm mb-1" value={block.time} onChange={(e) => updateBlock(idx, dIdx, bIdx, "time", e.target.value)} />
                                    <button type="button" onClick={() => removeBlock(idx, dIdx, bIdx)} className="text-red-500 text-xs ml-2">Remove</button>
                                  </div>
                                  <textarea placeholder="Description" rows={2} className="w-full p-1 border rounded text-sm mb-1" value={block.description} onChange={(e) => updateBlock(idx, dIdx, bIdx, "description", e.target.value)} />
                                  <input type="text" placeholder="Activities (comma separated)" className="w-full p-1 border rounded text-sm" value={block.activities.join(", ")} onChange={(e) => updateBlock(idx, dIdx, bIdx, "activities", e.target.value)} />
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <input type="text" placeholder="Meals (comma separated)" className="w-full p-2 border rounded" value={day.meals.join(", ")} onChange={(e) => updateItineraryDay(idx, dIdx, "meals", e.target.value)} />
                              <input type="text" placeholder="Overnight (lodge name)" className="w-full p-2 border rounded" value={day.overnight} onChange={(e) => updateItineraryDay(idx, dIdx, "overnight", e.target.value)} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="border-t pt-4">
                        <label className="block font-semibold mb-2">Pricing</label>
                        <select className="w-full p-2 border rounded-lg mb-3" value={opt.priceType} onChange={(e) => updateOption(idx, "priceType", e.target.value as "fixed" | "tiered" | "contact")}>
                          <option value="fixed">Fixed Price (per person)</option>
                          <option value="tiered">Tiered by Group Size</option>
                          <option value="contact">Contact for Price</option>
                        </select>
                        {opt.priceType === "fixed" && (
                          <div><label className="text-sm">Price (USD per person)</label><input type="number" className="w-full p-2 border rounded-lg" value={opt.priceAmount || ""} onChange={(e) => updateOption(idx, "priceAmount", parseFloat(e.target.value))} /></div>
                        )}
                        {opt.priceType === "tiered" && (
                          <div>
                            <div className="flex justify-between items-center mb-2"><label className="text-sm font-medium">Price Tiers</label><button type="button" onClick={() => addPriceTier(idx)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">+ Add Tier</button></div>
                            {opt.priceTiers.map((tier, tIdx) => (
                              <div key={tIdx} className="flex flex-wrap gap-2 mb-2 items-end">
                                <div className="w-24"><input type="number" placeholder="Min" className="w-full p-1 border rounded text-sm" value={tier.minPax} onChange={(e) => updatePriceTier(idx, tIdx, "minPax", parseInt(e.target.value))} /></div>
                                <div className="w-24"><input type="number" placeholder="Max" className="w-full p-1 border rounded text-sm" value={tier.maxPax} onChange={(e) => updatePriceTier(idx, tIdx, "maxPax", parseInt(e.target.value))} /></div>
                                <div className="w-32"><input type="number" placeholder="Price USD" className="w-full p-1 border rounded text-sm" value={tier.pricePerPerson} onChange={(e) => updatePriceTier(idx, tIdx, "pricePerPerson", parseFloat(e.target.value))} /></div>
                                <button type="button" onClick={() => removePriceTier(idx, tIdx)} className="text-red-500 text-sm">Remove</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3">
                          <label className="text-sm">Show More Content (optional)</label>
                          <textarea rows={3} className="w-full p-2 border rounded-lg mt-1" value={opt.showMoreContent} onChange={(e) => updateOption(idx, "showMoreContent", e.target.value)} placeholder="Additional details shown after &quot;Read more&quot;..." />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 -mx-4 px-4 md:mx-0 md:px-0 flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2">
              {loading && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {loading ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
      {showPreview && <PreviewModal />}
    </div>
  );
}