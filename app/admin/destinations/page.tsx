"use client";
import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { 
  Upload, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Edit2, 
  Check, 
  X, 
  Search, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Plus
} from "lucide-react";

interface ImageItem {
  _id: string;
  url: string;
  alt: string;
  order: number;
  filename?: string;
  createdAt: string;
}

// Simple Toast component
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}>
        {type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
        {message}
      </div>
    </div>
  );
};

// Confirmation modal – fixed the `any` type
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default function ManageDestinations() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [editAltValue, setEditAltValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.alt.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, images]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/destination-images");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data);
    } catch {
      setToast({ message: "Failed to load images", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      formData.append("alt", altText || "Destination image");
      const res = await fetch("/api/destination-images/upload", { method: "POST", body: formData });
      if (res.ok) {
        await fetchImages();
        setSelectedFile(null);
        setImageUrl(null);
        setAltText("");
        setToast({ message: "Image uploaded successfully", type: "success" });
      } else {
        throw new Error();
      }
    } catch {
      setToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    const res = await fetch(`/api/destination-images/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchImages();
      setToast({ message: "Image deleted", type: "success" });
    } else {
      setToast({ message: "Delete failed", type: "error" });
    }
    setDeleteTarget(null);
  };

  const updateAlt = async (id: string, newAlt: string) => {
    const res = await fetch(`/api/destination-images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: newAlt }),
    });
    if (res.ok) {
      await fetchImages();
      setToast({ message: "Alt text updated", type: "success" });
    } else {
      setToast({ message: "Update failed", type: "error" });
    }
    setEditingAlt(null);
  };

  const updateOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex(i => i._id === id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === images.length - 1) return;
    const newOrder = direction === "up" 
      ? images[currentIndex - 1].order 
      : images[currentIndex + 1].order;
    const res = await fetch(`/api/destination-images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    if (res.ok) {
      await fetchImages();
      setToast({ message: "Order updated", type: "success" });
    } else {
      setToast({ message: "Reorder failed", type: "error" });
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    for (const id of selectedIds) {
      await fetch(`/api/destination-images/${id}`, { method: "DELETE" });
    }
    await fetchImages();
    setSelectedIds(new Set());
    setToast({ message: `${selectedIds.size} images deleted`, type: "success" });
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredImages.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredImages.map(img => img._id)));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteImage(deleteTarget!)}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Destination Images</h1>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          Upload New
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* Upload Crop Section */}
      {imageUrl && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><ImageIcon size={20} /> Crop & Upload</h2>
          <div className="relative h-64 md:h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              onClick={getCroppedImage}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => { setImageUrl(null); setSelectedFile(null); }}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by alt text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex gap-3">
            <button
              onClick={bulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Selected ({selectedIds.size})
            </button>
            <button onClick={selectAll} className="text-gray-600 hover:text-gray-800 underline">
              {selectedIds.size === filteredImages.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        )}
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500">No images found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <div key={img._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition hover:shadow-md">
              <div className="relative h-48 bg-gray-100">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(img._id)}
                    onChange={() => toggleSelect(img._id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => updateOrder(img._id, "up")}
                    className="bg-white/80 rounded-full p-1 hover:bg-white"
                    title="Move Up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => updateOrder(img._id, "down")}
                    className="bg-white/80 rounded-full p-1 hover:bg-white"
                    title="Move Down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {editingAlt === img._id ? (
                  <div className="flex gap-2">
                    <input
                      value={editAltValue}
                      onChange={(e) => setEditAltValue(e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      autoFocus
                    />
                    <button onClick={() => updateAlt(img._id, editAltValue)} className="text-green-600"><Check size={16} /></button>
                    <button onClick={() => setEditingAlt(null)} className="text-gray-500"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-700 line-clamp-2 flex-1">{img.alt || "No alt text"}</p>
                    <button onClick={() => { setEditingAlt(img._id); setEditAltValue(img.alt); }} className="text-gray-400 hover:text-blue-600 ml-2">
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setDeleteTarget(img._id)}
                  className="mt-2 text-red-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}