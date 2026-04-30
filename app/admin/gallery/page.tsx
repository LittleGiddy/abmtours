"use client";
import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { 
  Upload, Trash2, Edit2, Check, X, Loader2,
  ChevronUp, ChevronDown, Image as ImageIcon, Plus, Search
} from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  order: number;
  createdAt: string;
}

// Type for updatable fields
type UpdateableFields = Partial<Pick<GalleryImage, 'alt' | 'caption' | 'category' | 'order'>>;

const categories = [
  { value: "safari", label: "🦁 Safari" },
  { value: "beach", label: "🏖️ Beach" },
  { value: "mountain", label: "⛰️ Mountain" },
  { value: "culture", label: "🎭 Culture" },
];

const ADJECTIVES = ['Stunning', 'Breathtaking', 'Magnificent', 'Incredible', 'Captivating'];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [altText, setAltText] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [category, setCategory] = useState("safari");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      setFilteredImages(images.filter(img => 
        img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.caption.toLowerCase().includes(searchTerm.toLowerCase())
      ));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ message: "File size must be less than 2MB", type: "error" });
        return;
      }
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(imageUrl!, croppedAreaPixels);
      const croppedFile = new File([croppedImageBlob], selectedFile.name, { type: croppedImageBlob.type });
      const formData = new FormData();
      formData.append("image", croppedFile);
      formData.append("alt", altText || `Amazing ${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} moment`);
      formData.append("caption", captionText || "");
      formData.append("category", category);
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      if (res.ok) {
        await fetchImages();
        setSelectedFile(null);
        setImageUrl(null);
        setAltText("");
        setCaptionText("");
        setCategory("safari");
        setToast({ message: "Image uploaded successfully", type: "success" });
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setUploading(false);
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
    const currentIndex = images.findIndex(i => i._id === id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === images.length - 1) return;
    const newOrder = direction === "up" 
      ? images[currentIndex - 1].order 
      : images[currentIndex + 1].order;
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <label className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 text-sm">
          <Plus size={16} /> Upload Image
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {imageUrl && (
        <div className="bg-white rounded-xl shadow-md border p-4 mb-6">
          <p className="text-xs text-gray-500 mb-2">Crop to 5:4 ratio</p>
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={5 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              placeholder="Alt text (SEO)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Caption (short description)"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
            <div className="flex gap-2">
              <button
                onClick={getCroppedImage}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {uploading ? "Uploading" : "Upload"}
              </button>
              <button onClick={() => { setImageUrl(null); setSelectedFile(null); }} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by alt or caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredImages.map(img => (
          <div key={img._id} className="bg-white rounded-xl shadow border overflow-hidden group">
            <div className="relative aspect-square sm:aspect-[4/3] bg-gray-100">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:sm:opacity-100 transition">
                <button onClick={() => updateOrder(img._id, "up")} className="bg-white/80 rounded-full p-1.5 hover:bg-white shadow-sm"><ChevronUp size={14} /></button>
                <button onClick={() => updateOrder(img._id, "down")} className="bg-white/80 rounded-full p-1.5 hover:bg-white shadow-sm"><ChevronDown size={14} /></button>
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
                  <input value={editAlt} onChange={e => setEditAlt(e.target.value)} className="w-full border rounded px-2 py-1 text-xs" placeholder="Alt text" autoFocus />
                  <textarea
                    value={editCaption}
                    onChange={e => setEditCaption(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs resize-none"
                    rows={2}
                    placeholder="Caption"
                  />
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full border rounded px-2 py-1 text-xs">
                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateImage(img._id, { alt: editAlt, caption: editCaption, category: editCategory })} className="text-green-600 p-1"><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 p-1"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 truncate mb-1">Alt: {img.alt}</p>
                  <p className="text-xs text-gray-500 mb-1">{categories.find(c => c.value === img.category)?.label}</p>
                  <div className="flex justify-between items-center mt-2">
                    <button onClick={() => { setEditingId(img._id); setEditAlt(img.alt); setEditCaption(img.caption || ""); setEditCategory(img.category); }} className="text-blue-600 text-xs flex items-center gap-1 hover:underline"><Edit2 size={12} /> Edit</button>
                    <button onClick={() => setDeleteTarget(img._id)} className="text-red-600 text-xs flex items-center gap-1 hover:underline"><Trash2 size={12} /> Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="mx-auto mb-3 opacity-50" size={48} />
          <p className="text-sm">No images found. Click &quot;Upload Image&quot; to add your first gallery photo.</p>
        </div>
      )}
    </div>
  );
}