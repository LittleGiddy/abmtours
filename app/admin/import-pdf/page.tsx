// app/admin/import-pdf/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the structure of the AI-generated data (no any)
interface ImportedOption {
  optionTitle: string;
  description: string;
  activities: string;
  itineraryDays: Array<{
    day: number;
    title: string;
    blocks: Array<{ time: string; description: string; activities: string[] }>;
    meals: string[];
    overnight: string;
  }>;
  priceType: "fixed" | "tiered" | "contact";
  priceAmount?: number;
  priceTiers?: Array<{ minPax: number; maxPax: number; pricePerPerson: number }>;
  accommodation?: { title: string; description: string; images?: string[] };
}

interface ImportedPackageData {
  title: string;
  category: "Northern Circuit" | "Southern Circuit" | "Beach Vacation";
  shortDescription: string;
  overview: string;
  highlights: string[];
  arrivalText: string;
  quickInfo: string[];
  options: ImportedOption[];
  includedList?: string[];
  excludedList?: string[];
  slug?: string;
  heroImage?: string;
  cardImage?: string;
  mapImage?: string;
}

export default function ImportPDFPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<ImportedPackageData | null>(null);
  const [error, setError] = useState("");

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [mapImage, setMapImage] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [cardPreview, setCardPreview] = useState("");
  const [mapPreview, setMapPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [optionAccommodation, setOptionAccommodation] = useState<
    Array<{
      title: string;
      description: string;
      imageFiles: File[];
      previews: string[];
    }>
  >([]);

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const errorData = (await res.json()) as { error: string };
      throw new Error(errorData.error || "Image upload failed");
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "card" | "map") => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (type === "hero") {
      setHeroImage(f);
      setHeroPreview(URL.createObjectURL(f));
    } else if (type === "card") {
      setCardImage(f);
      setCardPreview(URL.createObjectURL(f));
    } else if (type === "map") {
      setMapImage(f);
      setMapPreview(URL.createObjectURL(f));
    }
  };

  const handleAccommodationImages = (optionIdx: number, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setOptionAccommodation((prev) => {
      const updated = [...prev];
      updated[optionIdx].imageFiles.push(...newFiles);
      updated[optionIdx].previews.push(...newPreviews);
      return updated;
    });
  };

  const removeAccommodationImage = (optionIdx: number, imgIdx: number) => {
    setOptionAccommodation((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[optionIdx].previews[imgIdx]);
      updated[optionIdx].imageFiles.splice(imgIdx, 1);
      updated[optionIdx].previews.splice(imgIdx, 1);
      return updated;
    });
  };

  const updateAccommodationText = (optionIdx: number, field: "title" | "description", value: string) => {
    setOptionAccommodation((prev) => {
      const updated = [...prev];
      updated[optionIdx][field] = value;
      return updated;
    });
  };

  const handleUpload = async () => {
    if (!file) return setError("Select a PDF");
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/parse-pdf", { method: "POST", body: fd });
      const data = (await res.json()) as { success: boolean; data: ImportedPackageData; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setGenerated(data.data);
      const options = data.data.options || [];
      const initAccom = options.map(() => ({
        title: "",
        description: "",
        imageFiles: [] as File[],
        previews: [] as string[],
      }));
      setOptionAccommodation(initAccom);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!generated) return;
    setSaving(true);
    setError("");
    try {
      const [heroUrl, cardUrl, mapUrl] = await Promise.all([
        heroImage ? uploadImage(heroImage) : Promise.resolve(""),
        cardImage ? uploadImage(cardImage) : Promise.resolve(""),
        mapImage ? uploadImage(mapImage) : Promise.resolve(""),
      ]);

      const finalOptions = await Promise.all(
        generated.options.map(async (opt, idx) => {
          const accData = optionAccommodation[idx];
          const accommodationImageUrls = await Promise.all(
            (accData?.imageFiles || []).map((f) => uploadImage(f))
          );
          // Use the accommodation title/description from user input, or from the original opt if available
          const originalAcc = opt.accommodation || { title: "", description: "" };
          return {
            ...opt,
            accommodation: {
              title: accData?.title || originalAcc.title,
              description: accData?.description || originalAcc.description,
              images: accommodationImageUrls,
            },
          };
        })
      );

      const finalPackage: ImportedPackageData & {
        heroImage: string;
        cardImage: string;
        mapImage: string;
        slug: string;
      } = {
        ...generated,
        heroImage: heroUrl,
        cardImage: cardUrl,
        mapImage: mapUrl,
        options: finalOptions,
        slug: generated.slug || generated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      };

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPackage),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/packages");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Import Safari from PDF (AI)</h1>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "AI analyzing..." : "Upload & Analyze"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {generated && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">AI-Generated Package Preview</h2>

            {/* Main Images Upload */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-medium mb-3">Main Images (optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Hero Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleMainImageChange(e, "hero")} />
                  {heroPreview && <Image src={heroPreview} alt="Hero" width={100} height={60} className="mt-2 rounded object-cover" />}
                </div>
                <div>
                  <label className="block text-sm font-medium">Card Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleMainImageChange(e, "card")} />
                  {cardPreview && <Image src={cardPreview} alt="Card" width={100} height={60} className="mt-2 rounded object-cover" />}
                </div>
                <div>
                  <label className="block text-sm font-medium">Map Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleMainImageChange(e, "map")} />
                  {mapPreview && <Image src={mapPreview} alt="Map" width={100} height={60} className="mt-2 rounded object-cover" />}
                </div>
              </div>
            </div>

            {/* Options with Accommodation Images & Text */}
            {generated.options &&
              generated.options.map((opt, idx) => {
                const acc = optionAccommodation[idx];
                const originalAcc = opt.accommodation;
                return (
                  <div key={idx} className="border rounded-lg p-4 mb-6 bg-white shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Option {idx + 1}: {opt.optionTitle}</h3>
                    <div className="mb-3">
                      <label className="block text-sm font-medium">Accommodation Title</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={acc?.title || originalAcc?.title || ""}
                        onChange={(e) => updateAccommodationText(idx, "title", e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium">Accommodation Description</label>
                      <textarea
                        rows={2}
                        className="w-full border rounded p-2"
                        value={acc?.description || originalAcc?.description || ""}
                        onChange={(e) => updateAccommodationText(idx, "description", e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium">Accommodation Images</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleAccommodationImages(idx, e.target.files)}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {acc?.previews.map((src, imgIdx) => (
                          <div key={imgIdx} className="relative w-20 h-20 border rounded overflow-hidden">
                            <Image src={src} alt="Preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => removeAccommodationImage(idx, imgIdx)}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

            <details className="mb-6">
              <summary className="cursor-pointer text-sm text-gray-600">Show AI‑generated JSON</summary>
              <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96 mt-2">
                <pre className="text-xs">{JSON.stringify(generated, null, 2)}</pre>
              </div>
            </details>

            <div className="flex gap-4">
              <button onClick={() => setGenerated(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save to Database"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}