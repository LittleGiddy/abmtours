// app/admin/packages/edit/[id]/page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const { id } = use(params); // ✅ Correctly unwrap the async params
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
    const data = await res.json();
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "cardImage" | "heroImage" | "mapImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (field === "cardImage" || field === "heroImage") {
      setImages(prev => ({ ...prev, [field]: url }));
      setFormData(prev => prev ? { ...prev, [field]: url } : prev);
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

  const updateOption = (index: number, field: string, value: any) => {
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

  const updateItineraryDay = (optionIndex: number, dayIndex: number, field: string, value: any) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const updatedDays = [...(opt.itineraryDays || [])];
      if (field === "activities" && typeof value === "string") {
        updatedDays[dayIndex].activities = value.split(",").map(s => s.trim());
      } else {
        (updatedDays[dayIndex] as any)[field] = value;
      }
      updateOption(optionIndex, "itineraryDays", updatedDays);
    }
  };

  const removeItineraryDay = (optionIndex: number, dayIndex: number) => {
    if (formData) {
      const opt = formData.options[optionIndex];
      const updatedDays = (opt.itineraryDays || []).filter((_, i) => i !== dayIndex);
      updatedDays.forEach((day, idx) => { day.day = idx + 1; });
      updateOption(optionIndex, "itineraryDays", updatedDays);
    }
  };

  const addPriceTier = (optionIndex: number) => {
    const opt = formData!.options[optionIndex];
    const tiers = opt.priceTiers || [];
    updateOption(optionIndex, "priceTiers", [...tiers, { minPax: 1, maxPax: 1, pricePerPerson: 0 }]);
  };
  const updatePriceTier = (optionIndex: number, tierIndex: number, field: string, value: number) => {
    const opt = formData!.options[optionIndex];
    const tiers = opt.priceTiers ? [...opt.priceTiers] : [];
    tiers[tierIndex] = { ...tiers[tierIndex], [field]: value };
    updateOption(optionIndex, "priceTiers", tiers);
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
        const data = await res.json();
        const normalizedOptions = (data.options || []).map((opt: any) => ({
          ...opt,
          itineraryDays: (opt.itineraryDays || []).map((day: any) => ({
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
        const error = await res.json();
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
    return <div className="min-h-screen flex items-center justify-center">Loading package...</div>;
  }
  if (!formData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Package not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Safari Package</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" required className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Category *</label><select className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })}><option value="Northern Circuit">Northern Circuit</option><option value="Southern Circuit">Southern Circuit</option><option value="Beach Vacation">Beach Vacation</option></select></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Short Description *</label><textarea required rows={2} className="w-full p-2 border rounded" value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} /></div>
            </div>
          </div>

          {/* Images */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label>Card Image *</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, "cardImage")} />{images.cardImage && <div className="relative h-32 w-32 mt-2"><Image src={images.cardImage} alt="card" fill className="object-cover rounded" /></div>}</div>
              <div><label>Hero Image *</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, "heroImage")} />{images.heroImage && <div className="relative h-32 w-full mt-2"><Image src={images.heroImage} alt="hero" fill className="object-cover rounded" /></div>}</div>
              <div><label>Map Image</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, "mapImage")} />{formData.mapImage && <div className="relative h-32 w-48 mt-2"><Image src={formData.mapImage} alt="map" fill className="object-cover rounded" /></div>}</div>
            </div>
          </div>

          {/* Content */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <div className="space-y-4">
              <div><label>Overview *</label><textarea required rows={4} className="w-full p-2 border rounded" value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })} /></div>
              <div><label>Highlights</label><div className="flex gap-2 mb-2"><input type="text" className="flex-1 p-2 border rounded" value={highlightInput} onChange={e => setHighlightInput(e.target.value)} /><button type="button" onClick={addHighlight} className="bg-blue-500 text-white px-4 rounded">Add</button></div><ul className="list-disc pl-5">{formData.highlights.map((h, i) => <li key={i} className="flex justify-between"><span>{h}</span><button type="button" onClick={() => removeHighlight(i)} className="text-red-500 text-sm">Remove</button></li>)}</ul></div>
              <div><label>Arrival Text *</label><textarea required rows={3} className="w-full p-2 border rounded" value={formData.arrivalText} onChange={e => setFormData({ ...formData, arrivalText: e.target.value })} /></div>
              <div><label>Quick Information</label><div className="flex gap-2 mb-2"><input type="text" className="flex-1 p-2 border rounded" value={quickInfoInput} onChange={e => setQuickInfoInput(e.target.value)} /><button type="button" onClick={addQuickInfo} className="bg-blue-500 text-white px-4 rounded">Add</button></div><ul className="list-disc pl-5">{formData.quickInfo.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
            </div>
          </div>

          {/* Options */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Tour Options</h2><button type="button" onClick={addOption} className="bg-green-500 text-white px-4 py-2 rounded">Add Option</button></div>
            {formData.options.map((opt, idx) => {
              const accommodation = opt.accommodation || { title: "", description: "", images: [] };
              const itineraryDays = opt.itineraryDays || [];
              return (
                <div key={idx} className="border rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-3">Option {idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label>Option Title *</label><input type="text" required className="w-full p-2 border rounded" value={opt.optionTitle} onChange={e => updateOption(idx, "optionTitle", e.target.value)} /></div>
                    <div><label>Activities (short) *</label><input type="text" required className="w-full p-2 border rounded" value={opt.activities} onChange={e => updateOption(idx, "activities", e.target.value)} /></div>
                    <div className="md:col-span-2"><label>Description *</label><textarea required rows={2} className="w-full p-2 border rounded" value={opt.description} onChange={e => updateOption(idx, "description", e.target.value)} /></div>
                    <div className="md:col-span-2"><label>Main Image *</label><input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadOptionImage(idx, f, true); }} />{opt.mainImage && <div className="relative h-32 w-48 mt-2"><Image src={opt.mainImage} alt="main" fill className="object-cover rounded" /></div>}</div>
                  </div>

                  {/* Accommodation */}
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold">Accommodation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><label>Title</label><input type="text" className="w-full p-2 border rounded" value={accommodation.title} onChange={e => updateOption(idx, "accommodation", { ...accommodation, title: e.target.value })} /></div>
                      <div className="md:col-span-2"><label>Description</label><textarea rows={2} className="w-full p-2 border rounded" value={accommodation.description} onChange={e => updateOption(idx, "accommodation", { ...accommodation, description: e.target.value })} /></div>
                    </div>
                    <div><label>Accommodation Images</label><input type="file" accept="image/*" multiple onChange={async (e) => { const files = Array.from(e.target.files || []); for (const file of files) await uploadOptionImage(idx, file, false); }} /><div className="grid grid-cols-4 gap-2 mt-2">{accommodation.images.map((img, imgIdx) => (<div key={imgIdx} className="relative h-20"><Image src={img} alt="acc" fill className="object-cover rounded" /><button type="button" onClick={() => removeAccommodationImage(idx, imgIdx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button></div>))}</div></div>
                  </div>

                  {/* Itinerary Days */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center"><h4 className="font-semibold">Itinerary Days</h4><button type="button" onClick={() => addItineraryDay(idx)} className="bg-indigo-500 text-white px-2 py-1 text-sm rounded">Add Day</button></div>
                    {itineraryDays.map((day, dIdx) => (
                      <div key={dIdx} className="border p-2 mt-2 rounded">
                        <div className="flex justify-between"><strong>Day {day.day}</strong><button type="button" onClick={() => removeItineraryDay(idx, dIdx)} className="text-red-500 text-sm">Remove</button></div>
                        <input type="text" placeholder="Title" className="w-full p-1 border my-1" value={day.title} onChange={e => updateItineraryDay(idx, dIdx, "title", e.target.value)} />
                        <textarea placeholder="Description" rows={2} className="w-full p-1 border my-1" value={day.description} onChange={e => updateItineraryDay(idx, dIdx, "description", e.target.value)} />
                        <input type="text" placeholder="Activities (comma separated)" className="w-full p-1 border my-1" value={(day.activities || []).join(", ")} onChange={e => updateItineraryDay(idx, dIdx, "activities", e.target.value)} />
                        <input type="text" placeholder="Meals (e.g., Breakfast, Lunch)" className="w-full p-1 border my-1" value={day.meals || ""} onChange={e => updateItineraryDay(idx, dIdx, "meals", e.target.value)} />
                        <input type="text" placeholder="Overnight (e.g., Safari Lodge)" className="w-full p-1 border my-1" value={day.overnight || ""} onChange={e => updateItineraryDay(idx, dIdx, "overnight", e.target.value)} />
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-3 mt-3">
                    <label>Price Type</label>
                    <select className="w-full p-2 border rounded" value={opt.priceType} onChange={e => updateOption(idx, "priceType", e.target.value)}>
                      <option value="fixed">Fixed Price</option>
                      <option value="tiered">Tiered by Group Size</option>
                      <option value="contact">Contact for Price</option>
                    </select>
                    {opt.priceType === "fixed" && (<div className="mt-2"><label>Price Amount (USD)</label><input type="number" className="w-full p-2 border rounded" value={opt.priceAmount || ""} onChange={e => updateOption(idx, "priceAmount", parseFloat(e.target.value))} /></div>)}
                    {opt.priceType === "tiered" && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center"><label>Price Tiers</label><button type="button" onClick={() => addPriceTier(idx)} className="text-sm bg-gray-200 px-2 py-1 rounded">+ Add Tier</button></div>
                        {(opt.priceTiers || []).map((tier, tIdx) => (
                          <div key={tIdx} className="flex gap-2 mt-1">
                            <input type="number" placeholder="Min Pax" className="w-24 p-1 border rounded" value={tier.minPax} onChange={e => updatePriceTier(idx, tIdx, "minPax", parseInt(e.target.value))} />
                            <input type="number" placeholder="Max Pax" className="w-24 p-1 border rounded" value={tier.maxPax} onChange={e => updatePriceTier(idx, tIdx, "maxPax", parseInt(e.target.value))} />
                            <input type="number" placeholder="Price USD" className="w-32 p-1 border rounded" value={tier.pricePerPerson} onChange={e => updatePriceTier(idx, tIdx, "pricePerPerson", parseFloat(e.target.value))} />
                            <button type="button" onClick={() => removePriceTier(idx, tIdx)} className="text-red-500 text-sm">Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3"><label>Show More Content (Optional)</label><textarea rows={3} className="w-full p-2 border rounded" value={opt.showMoreContent} onChange={e => updateOption(idx, "showMoreContent", e.target.value)} /></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}