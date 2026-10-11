"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Check, AlertCircle, Eye, Type } from "lucide-react";
import {
  SECTION_KEYS,
  SECTION_LABELS,
  defaultSection,
  type SiteSectionKey,
  type SiteSectionContent,
} from "@/lib/siteContent";

type DraftMap = Record<string, SiteSectionContent>;

export default function AdminSiteContent() {
  const [drafts, setDrafts] = useState<DraftMap>(() =>
    Object.fromEntries(SECTION_KEYS.map((key) => [key, defaultSection(key)]))
  );
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<SiteSectionKey | null>("destinations");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => (res.ok ? res.json() : []))
      .then((docs: Array<{ key: string; heading?: string; tagline?: string }>) => {
        const next: DraftMap = {};
        for (const key of SECTION_KEYS) {
          const saved = Array.isArray(docs) ? docs.find((d) => d.key === key) : null;
          const fallback = defaultSection(key);
          next[key] = {
            key,
            heading: saved?.heading ?? fallback.heading,
            tagline: saved?.tagline ?? fallback.tagline,
          };
        }
        setDrafts(next);
      })
      .catch(() => setToast({ message: "Failed to load content", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, field: "heading" | "tagline", value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const save = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts[key]),
      });
      if (!res.ok) throw new Error();
      setToast({ message: "Content saved", type: "success" });
    } catch {
      setToast({ message: "Save failed", type: "error" });
    } finally {
      setSavingKey(null);
    }
  };

  const resetToDefault = (key: string) => {
    setDrafts((prev) => ({ ...prev, [key]: defaultSection(key) }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading content...
      </div>
    );
  }

  const activePreview = previewKey ? drafts[previewKey] : null;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <Type className="text-blue-600" size={22} />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Site Content</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Edit the heading text for landing-page sections. Changes go live on the homepage.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editors */}
        <div className="lg:col-span-2 space-y-5">
          {SECTION_KEYS.map((key) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">{SECTION_LABELS[key]}</h2>
                <button
                  type="button"
                  onClick={() => setPreviewKey(key)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Eye size={14} /> Preview
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-600 mb-1">Heading</label>
              <input
                value={drafts[key].heading}
                onChange={(e) => update(key, "heading", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-sm font-medium text-gray-600 mb-1">Tagline</label>
              <textarea
                rows={2}
                value={drafts[key].tagline}
                onChange={(e) => update(key, "tagline", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => resetToDefault(key)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => save(key)}
                  disabled={savingKey === key}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {savingKey === key ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
              <Eye size={15} /> Frontend preview
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl text-blue-950 font-bold">
                  {activePreview?.heading || "Section heading"}
                </h1>
                {activePreview?.tagline && (
                  <p className="mt-2 text-sm text-gray-700 font-medium">
                    {activePreview.tagline}
                  </p>
                )}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md bg-gradient-to-br from-gray-100 to-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
