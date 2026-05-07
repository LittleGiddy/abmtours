// app/admin/packages/edit/[id]/page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Upload, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  meals?: string;
  overnight?: string;
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
  priceType: "fixed" | "contact" | "tiered";
  priceAmount: number | null;
  priceTiers?: { minPax: number; maxPax: number; pricePerPerson: number }[];
  showMoreContent: string;
}

interface PackageData {
  _id: string;
  title: string;
  slug: string;
  category: "Northern Circuit" | "Southern Circuit" | "Beach Vacation";
  shortDescription: string;
  cardImage: string;
  heroImage: string;
  mapImage: string;
  overview: string;
  highlights: string[];
  arrivalText: string;
  quickInfo: string[];
  options: Option[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export default function EditPackage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PackageData | null>(null);
  const [highlightInput, setHighlightInput] = useState("");
  const [quickInfoInput, setQuickInfoInput] = useState("");
  const [images, setImages] = useState({ cardImage: "", heroImage: "" });

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
    if (!res.ok) throw new Error("Upload failed");
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cardImage" | "heroImage" | "mapImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (field === "cardImage" || field === "heroImage") {
      setImages((prev) => ({ ...prev, [field]: url }));
      setFormData((prev) => (prev ? { ...prev, [field]: url } : prev));
    } else if (field === "mapImage" && formData) {
      setFormData({ ...formData, mapImage: url });
    }
  };

  const addHighlight = () => {
    if (highlightInput.trim() && formData) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput("");
    }
  };
  const removeHighlight = (index: number) => {
    if (formData) {
      setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
    }
  };

  const addQuickInfo = () => {
    if (quickInfoInput.trim() && formData) {
      setFormData({ ...formData, quickInfo: [...formData.quickInfo, quickInfoInput.trim()] });
      setQuickInfoInput("");
    }
  };

  const addOption = () => {
    if (formData) {
      setFormData({
        ...formData,
        options: [
          ...formData.options,
          {
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
          },
        ],
      });
    }
  };

  const updateOption = <K extends keyof Option>(index: number, field: K, value: Option[K]) => {
    if (formData) {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      setFormData({ ...formData, options: updatedOptions });
    }
  };

  const uploadOptionImage = async (index: number, file: File, isMainImage: boolean) => {
    const url = await uploadImage(file);
    if (isMainImage) {
      updateOption(index, "mainImage", url);
    } else {
      const opt = formData!.options[index];
      const currentAccommodation = opt.accommodation || { title: "", description: "", images: [] };
      updateOption(index, "accommodation", {
        ...currentAccommodation,
        images: [...currentAccommodation.images, url],
      });
    }
  };

  const removeAccommodationImage = (optionIndex: number, imgIndex: number) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const acc = opt.accommodation || { title: "", description: "", images: [] };
      const newImages = acc.images.filter((_, i) => i !== imgIndex);
      updateOption(optionIndex, "accommodation", { ...acc, images: newImages });
    }
  };

  const addItineraryDay = (optionIndex: number) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const currentDays = opt.itineraryDays || [];
      const newDay: ItineraryDay = {
        day: currentDays.length + 1,
        title: "",
        description: "",
        activities: [],
        meals: "",
        overnight: "",
      };
      updateOption(optionIndex, "itineraryDays", [...currentDays, newDay]);
    }
  };

  const updateItineraryDay = (
    optionIndex: number,
    dayIndex: number,
    field: keyof ItineraryDay,
    value: string | string[]
  ) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const updatedDays = [...(opt.itineraryDays || [])];
      if (field === "activities" && typeof value === "string") {
        updatedDays[dayIndex].activities = value.split(",").map((s) => s.trim());
      } else if (field === "title" && typeof value === "string") {
        updatedDays[dayIndex].title = value;
      } else if (field === "description" && typeof value === "string") {
        updatedDays[dayIndex].description = value;
      } else if (field === "meals" && typeof value === "string") {
        updatedDays[dayIndex].meals = value;
      } else if (field === "overnight" && typeof value === "string") {
        updatedDays[dayIndex].overnight = value;
      }
      updateOption(optionIndex, "itineraryDays", updatedDays);
    }
  };

  const removeItineraryDay = (optionIndex: number, dayIndex: number) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const updatedDays = (opt.itineraryDays || []).filter((_, i) => i !== dayIndex);
      updatedDays.forEach((day, idx) => (day.day = idx + 1));
      updateOption(optionIndex, "itineraryDays", updatedDays);
    }
  };

  const addPriceTier = (optionIndex: number) => {
    const opt = formData!.options[optionIndex];
    const tiers = opt.priceTiers || [];
    updateOption(optionIndex, "priceTiers", [...tiers, { minPax: 1, maxPax: 1, pricePerPerson: 0 }]);
  };

  const updatePriceTier = (
    optionIndex: number,
    tierIndex: number,
    field: keyof { minPax: number; maxPax: number; pricePerPerson: number },
    value: number
  ) => {
    const opt = formData!.options[optionIndex];
    const tiers = opt.priceTiers ? [...opt.priceTiers] : [];
    if (tiers[tierIndex]) {
      tiers[tierIndex] = { ...tiers[tierIndex], [field]: value };
      updateOption(optionIndex, "priceTiers", tiers);
    }
  };

  const removePriceTier = (optionIndex: number, tierIndex: number) => {
    const opt = formData!.options[optionIndex];
    const tiers = (opt.priceTiers || []).filter((_, i) => i !== tierIndex);
    updateOption(optionIndex, "priceTiers", tiers);
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as PackageData;
        const normalizedOptions = (data.options || []).map((opt) => ({
          ...opt,
          itineraryDays: (opt.itineraryDays || []).map((day) => ({
            ...day,
            activities: day.activities || [],
            meals: day.meals || "",
            overnight: day.overnight || "",
          })),
          accommodation: opt.accommodation || { title: "", description: "", images: [] },
          priceTiers: opt.priceTiers || [],
          showMoreContent: opt.showMoreContent || "",
        }));
        setFormData({ ...data, options: normalizedOptions });
        setImages({ cardImage: data.cardImage || "", heroImage: data.heroImage || "" });
      } catch (error) {
        console.error(error);
        alert("Failed to load package");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...updateData } = formData;
    if (!updateData.slug) {
      updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        router.push("/admin/packages");
      } else {
        const error = (await res.json()) as { error: string };
        alert(error.error || "Failed to update package");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading package...</div>
      </div>
    );
  }
  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Package not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Safari Package</h1>
          <p className="text-gray-600 mt-1">Modify package details, images, itinerary, and pricing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========== BASIC INFORMATION ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PackageData["category"] })}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== IMAGES ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Images</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card Image */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Image *</label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleImageUpload(e, "cardImage")} />
                  {images.cardImage && (
                    <div className="relative mt-3 aspect-square w-full max-w-[150px] rounded-lg overflow-hidden border bg-white">
                      <Image src={images.cardImage} alt="Card" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => ({ ...prev, cardImage: "" }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Hero Image */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image *</label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleImageUpload(e, "heroImage")} />
                  {images.heroImage && (
                    <div className="relative mt-3 aspect-video w-full rounded-lg overflow-hidden border bg-white">
                      <Image src={images.heroImage} alt="Hero" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => ({ ...prev, heroImage: "" }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Map Image */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Map Image</label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleImageUpload(e, "mapImage")} />
                  {formData.mapImage && (
                    <div className="relative mt-3 aspect-[4/3] w-full rounded-lg overflow-hidden border bg-white">
                      <Image src={formData.mapImage} alt="Map" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, mapImage: "" }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== CONTENT ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Content</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview *</label>
                <textarea required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Enter highlight" />
                  <button type="button" onClick={addHighlight} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {h}
                      <button type="button" onClick={() => removeHighlight(i)} className="text-red-600 hover:text-red-800 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Text *</label>
                <textarea required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.arrivalText} onChange={(e) => setFormData({ ...formData, arrivalText: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Information</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" value={quickInfoInput} onChange={(e) => setQuickInfoInput(e.target.value)} placeholder="e.g., Best Time: June-Oct" />
                  <button type="button" onClick={addQuickInfo} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add</button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.quickInfo.map((q, i) => <li key={i} className="text-gray-700">{q}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* ========== TOUR OPTIONS ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Tour Options</h2>
              <button type="button" onClick={addOption} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <Plus className="w-4 h-4" /> Add Option
              </button>
            </div>
            <div className="p-6 space-y-6">
              {formData.options.length === 0 && (
                <div className="text-center text-gray-500 py-12">No options added yet. Click &quot;Add Option&quot; to start.</div>
              )}
              {formData.options.map((opt, idx) => {
                const accommodation = opt.accommodation || { title: "", description: "", images: [] };
                const itineraryDays = opt.itineraryDays || [];
                return (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                      <h3 className="font-semibold text-gray-800">Option {idx + 1}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Remove this option?")) {
                            const newOptions = formData.options.filter((_, i) => i !== idx);
                            setFormData({ ...formData, options: newOptions });
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option Title *</label>
                          <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={opt.optionTitle} onChange={(e) => updateOption(idx, "optionTitle", e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Activities (short) *</label>
                          <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={opt.activities} onChange={(e) => updateOption(idx, "activities", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                          <textarea required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={opt.description} onChange={(e) => updateOption(idx, "description", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => document.getElementById(`mainImage-${idx}`)?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                              <Upload className="w-4 h-4" /> Upload
                            </button>
                            <input id={`mainImage-${idx}`} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadOptionImage(idx, f, true); }} />
                          </div>
                          {opt.mainImage && (
                            <div className="relative mt-3 w-48 h-32 rounded-lg overflow-hidden border">
                              <Image src={opt.mainImage} alt="main" fill className="object-cover" />
                              <button type="button" onClick={() => updateOption(idx, "mainImage", "")} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div className="border-t pt-4 mt-2">
                        <h4 className="font-semibold text-gray-800 mb-3">Accommodation Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Accommodation Title</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={accommodation.title} onChange={(e) => updateOption(idx, "accommodation", { ...accommodation, title: e.target.value })} />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-700 mb-1">Description</label>
                            <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={accommodation.description} onChange={(e) => updateOption(idx, "accommodation", { ...accommodation, description: e.target.value })} />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm text-gray-700 mb-2">Accommodation Images</label>
                          <button type="button" onClick={() => document.getElementById(`accImages-${idx}`)?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                            <Upload className="w-4 h-4" /> Add Images
                          </button>
                          <input id={`accImages-${idx}`} type="file" accept="image/*" multiple className="hidden" onChange={async (e) => { const files = Array.from(e.target.files || []); for (const file of files) await uploadOptionImage(idx, file, false); }} />
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                            {accommodation.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100">
                                <Image src={img} alt="accommodation" fill className="object-cover" />
                                <button type="button" onClick={() => removeAccommodationImage(idx, imgIdx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"><Trash2 className="w-3 h-3" /></button>
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
                        <div className="space-y-3">
                          {itineraryDays.map((day, dIdx) => (
                            <div key={dIdx} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Day {day.day}</span>
                                <button type="button" onClick={() => removeItineraryDay(idx, dIdx)} className="text-red-500 text-sm">Remove Day</button>
                              </div>
                              <input type="text" placeholder="Title" className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg" value={day.title} onChange={(e) => updateItineraryDay(idx, dIdx, "title", e.target.value)} />
                              <textarea placeholder="Description" rows={2} className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg" value={day.description} onChange={(e) => updateItineraryDay(idx, dIdx, "description", e.target.value)} />
                              <input type="text" placeholder="Activities (comma separated)" className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg" value={(day.activities || []).join(", ")} onChange={(e) => updateItineraryDay(idx, dIdx, "activities", e.target.value)} />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input type="text" placeholder="Meals (e.g., Breakfast, Lunch)" className="px-3 py-2 border border-gray-300 rounded-lg" value={day.meals || ""} onChange={(e) => updateItineraryDay(idx, dIdx, "meals", e.target.value)} />
                                <input type="text" placeholder="Overnight (e.g., Safari Lodge)" className="px-3 py-2 border border-gray-300 rounded-lg" value={day.overnight || ""} onChange={(e) => updateItineraryDay(idx, dIdx, "overnight", e.target.value)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Type</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3" value={opt.priceType} onChange={(e) => updateOption(idx, "priceType", e.target.value as Option["priceType"])}>
                          <option value="fixed">Fixed Price (per person)</option>
                          <option value="tiered">Tiered by Group Size</option>
                          <option value="contact">Contact for Price</option>
                        </select>
                        {opt.priceType === "fixed" && (
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Price (USD per person)</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={opt.priceAmount || ""} onChange={(e) => updateOption(idx, "priceAmount", parseFloat(e.target.value))} />
                          </div>
                        )}
                        {opt.priceType === "tiered" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm font-medium">Price Tiers</label>
                              <button type="button" onClick={() => addPriceTier(idx)} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">+ Add Tier</button>
                            </div>
                            <div className="space-y-2">
                              {(opt.priceTiers || []).map((tier, tIdx) => (
                                <div key={tIdx} className="flex flex-wrap gap-2 items-end">
                                  <div className="w-24"><input type="number" placeholder="Min" className="w-full p-1 border rounded text-sm" value={tier.minPax} onChange={(e) => updatePriceTier(idx, tIdx, "minPax", parseInt(e.target.value))} /></div>
                                  <div className="w-24"><input type="number" placeholder="Max" className="w-full p-1 border rounded text-sm" value={tier.maxPax} onChange={(e) => updatePriceTier(idx, tIdx, "maxPax", parseInt(e.target.value))} /></div>
                                  <div className="w-32"><input type="number" placeholder="Price" className="w-full p-1 border rounded text-sm" value={tier.pricePerPerson} onChange={(e) => updatePriceTier(idx, tIdx, "pricePerPerson", parseFloat(e.target.value))} /></div>
                                  <button type="button" onClick={() => removePriceTier(idx, tIdx)} className="text-red-500 text-sm">Remove</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-4">
                          <label className="block text-sm text-gray-700 mb-1">Show More Content (optional)</label>
                          <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={opt.showMoreContent} onChange={(e) => updateOption(idx, "showMoreContent", e.target.value)} placeholder="Additional details shown after 'Read more'..." />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 sticky bottom-4 bg-gray-50 py-4 border-t border-gray-200 -mx-4 px-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2">
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}