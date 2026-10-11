"use client";
import { useState, useEffect } from "react";
import {
  Trash2, Edit2, Check, X, Loader2,
  ChevronUp, ChevronDown, Image as ImageIcon, Plus, Search, Eye, Replace,
} from "lucide-react";
import ImageUploader, { type UploadedImage } from "@/app/components/admin/ImageUploader";

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  order: number;
  createdAt: string;
}

type UpdateableFields = Partial<Pick<GalleryImage, "alt" | "caption" | "category" | "order">>;

const categories = [
  { value: "safari", label: "🦁 Safari" },
  { value: "beach", label: "🏖️ Beach" },
  { value: "mountain", label: "⛰️ Mountain" },
  { value: "culture", label: "🎭 Culture" },
];

const ADJECTIVES = ["Stunning", "Breathtaking", "Magnificent", "Incredible", "Captivating"];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [altText, setAltText] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [category, setCategory] = useState("safari");
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<GalleryImage | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredImages(images);
    } else {
      setFilteredImages(
        images.filter(
          (img) =>
            img.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            img.caption?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, images]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data);
    } catch {
      setToast({ message: "Failed to load gallery", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = async () => {
    if (!uploaded) return;
    setCreating(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploaded.url,
          publicId: uploaded.publicId,
          alt: altText || `Amazing ${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} moment`,
          caption: captionText,
          category,
        }),
      });
      if (!res.ok) throw new Error();
      await fetchImages();
      resetAdd();
      setToast({ message: "Image added to gallery", type: "success" });
    } catch {
      setToast({ message: "Failed to add image", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const resetAdd = () => {
    setUploaded(null);
    setAltText("");
    setCaptionText("");
    setCategory("safari");
    setShowAdd(false);
  };

  const replaceImage = async (id: string, img: UploadedImage) => {
    setReplacing(true);
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: img.url, publicId: img.publicId }),
      });
      if (!res.ok) throw new Error();
      await fetchImages();
      setToast({ message: "Image replaced", type: "success" });
      setReplaceTarget(null);
    } catch {
      setToast({ message: "Replace failed", type: "error" });
    } finally {
      setReplacing(false);
    }
  };

  const deleteImage = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchImages();
      setToast({ message: "Image deleted", type: "success" });
    } else {
      setToast({ message: "Delete failed", type: "error" });
    }
    setDeleteTarget(null);
  };

  const updateImage = async (id: string, data: UpdateableFields) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchImages();
      setToast({ message: "Updated successfully", type: "success" });
    } else {
      setToast({ message: "Update failed", type: "error" });
    }
    setEditingId(null);
  };

  const updateOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((i) => i._id === id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === images.length - 1) return;
    const newOrder =
      direction === "up" ? images[currentIndex - 1].order : images[currentIndex + 1].order;
    await fetch(`/api/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    await fetchImages();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading gallery...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 p-3 rounded-lg shadow-lg z-50 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white text-sm sm:text-base`}>
          {toast.message}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Delete Image</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this image?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteImage(deleteTarget)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal — mirrors the frontend lightbox */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white"
            >
              <X size={26} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={preview.alt} className="w-full rounded-xl max-h-[80vh] object-contain bg-black" />
            <div className="text-center mt-3">
              <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full mb-2">
                {categories.find((c) => c.value === preview.category)?.label}
              </span>
              {preview.caption && <p className="text-white text-sm">{preview.caption}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Replace modal */}
      {replaceTarget && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => !replacing && setReplaceTarget(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Replace Image</h3>
              <button onClick={() => setReplaceTarget(null)} disabled={replacing} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <ImageUploader
              label="New photo"
              folder="abmtours/gallery"
              value={replaceTarget.url}
              onChange={(img) => { if (img) replaceImage(replaceTarget._id, img); }}
              aspect={4 / 3}
              maxSizeMB={5}
              previewHeightClass="h-56"
              showRemove={false}
              helperText="Crop, zoom & rotate, then upload to replace"
            />
            {replacing && (
              <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="animate-spin" size={15} /> Replacing...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gallery</h1>
        <button
          onClick={() => (showAdd ? resetAdd() : setShowAdd(true))}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          {showAdd ? <X size={18} /> : <Plus size={18} />}
          {showAdd ? "Cancel" : "Add Image"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUploader
              label="Photo"
              folder="abmtours/gallery"
              value={uploaded?.url}
              onChange={setUploaded}
              aspect={4 / 3}
              maxSizeMB={5}
              helperText="Crop, zoom, rotate, then upload"
            />
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Alt text (SEO)</label>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Lions resting in the Serengeti"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="Short description shown in the lightbox"
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addImage}
                disabled={!uploaded || creating}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {creating ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {creating ? "Saving..." : "Add to Gallery"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1 max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by alt or caption..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredImages.map((img) => (
          <div key={img._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition hover:shadow-md">
            <div className="relative h-48 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => setPreview(img)} className="bg-white/90 rounded-full p-1.5 hover:bg-white" title="Preview">
                  <Eye size={15} />
                </button>
                <button onClick={() => updateOrder(img._id, "up")} className="bg-white/90 rounded-full p-1.5 hover:bg-white" title="Move Up">
                  <ChevronUp size={15} />
                </button>
                <button onClick={() => updateOrder(img._id, "down")} className="bg-white/90 rounded-full p-1.5 hover:bg-white" title="Move Down">
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>
            <div className="p-3">
              {img.caption && (
                <div className="max-h-16 overflow-y-auto text-xs text-gray-600 italic mb-1 pr-1">
                  {img.caption}
                </div>
              )}
              {editingId === img._id ? (
                <div className="space-y-2">
                  <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} className="w-full border rounded px-2 py-1 text-xs" placeholder="Alt text" autoFocus />
                  <textarea
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs resize-none"
                    rows={2}
                    placeholder="Caption"
                  />
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border rounded px-2 py-1 text-xs">
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateImage(img._id, { alt: editAlt, caption: editCaption, category: editCategory })} className="text-green-600 p-1"><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 p-1"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 truncate mb-1">Alt: {img.alt}</p>
                  <p className="text-xs text-gray-500 mb-1">{categories.find((c) => c.value === img.category)?.label}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <button onClick={() => { setEditingId(img._id); setEditAlt(img.alt); setEditCaption(img.caption || ""); setEditCategory(img.category); }} className="text-blue-600 text-xs flex items-center gap-1 hover:underline"><Edit2 size={12} /> Edit</button>
                    <button onClick={() => setReplaceTarget(img)} className="text-emerald-600 text-xs flex items-center gap-1 hover:underline"><Replace size={12} /> Replace</button>
                    <button onClick={() => setDeleteTarget(img._id)} className="text-red-600 text-xs flex items-center gap-1 hover:underline"><Trash2 size={12} /> Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="mx-auto mb-3 opacity-50" size={48} />
          <p className="text-sm">No images found. Click &quot;Add Image&quot; to add your first gallery photo.</p>
        </div>
      )}
    </div>
  );
}
