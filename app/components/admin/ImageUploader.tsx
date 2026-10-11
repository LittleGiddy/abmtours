"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import {
  Upload,
  X,
  Loader2,
  RotateCw,
  ZoomIn,
  Replace,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface AspectOption {
  label: string;
  value: number;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (image: UploadedImage | null) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  aspect?: number;
  aspectOptions?: AspectOption[];
  maxSizeMB?: number;
  previewHeightClass?: string;
  className?: string;
  showRemove?: boolean;
}

const DEFAULT_ASPECTS: AspectOption[] = [
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function ImageUploader({
  value,
  onChange,
  folder = "abmtours",
  label = "Image",
  helperText,
  aspect = 4 / 3,
  aspectOptions = DEFAULT_ASPECTS,
  maxSizeMB = 5,
  previewHeightClass = "h-44",
  className = "",
  showRemove = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedAspect, setSelectedAspect] = useState(aspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const closeCrop = useCallback(() => {
    setSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  }, []);

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && src) closeCrop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, closeCrop]);

  const accept = (file: File) => {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError("Unsupported format. Use JPG, PNG, WebP, GIF or AVIF.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large (max ${maxSizeMB}MB). Please choose a smaller image.`);
      return;
    }
    setSelectedAspect(aspect);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setSrc(URL.createObjectURL(file));
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) accept(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) accept(file);
  };

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleUpload = async () => {
    if (!src || !croppedAreaPixels) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels, rotation, {
        maxDimension: 2400,
        quality: 0.88,
        mimeType: "image/jpeg",
      });
      const file = new File([blob], `upload-${Date.now()}.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const info = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(info.error || "Upload failed");
      }
      const data = (await res.json()) as { url: string; publicId?: string };
      onChange({ url: data.url, publicId: data.publicId ?? "" });
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 2000);
      closeCrop();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <span className="text-[11px] text-gray-400">max {maxSizeMB}MB</span>
        </div>
      )}

      {value ? (
        <div className={`relative ${previewHeightClass} w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-100"
            >
              <Replace size={14} /> Replace
            </button>
            {showRemove && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-700"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          {justUploaded && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check size={12} /> Uploaded
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`w-full ${previewHeightClass} rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-center px-4 transition ${
            dragging
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-400 hover:bg-blue-50/40"
          }`}
        >
          <Upload size={20} />
          <span className="text-sm font-medium">Click or drag an image here</span>
          <span className="text-[11px] text-gray-400">
            {helperText || "JPG, PNG, WebP • crop, zoom & rotate after selecting"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onFileInput}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {/* Crop modal */}
      {src && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Crop & adjust image</h3>
              <button type="button" onClick={closeCrop} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="relative bg-gray-900 h-[45vh] min-h-[260px]">
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={selectedAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid
              />
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Aspect ratios */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-full sm:w-auto">Aspect</span>
                {aspectOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedAspect(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      selectedAspect === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Zoom + rotate */}
              <div className="flex items-center gap-3">
                <ZoomIn size={16} className="text-gray-500 shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                  aria-label="Zoom"
                />
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  title="Rotate 90°"
                >
                  <RotateCw size={16} />
                </button>
                <span className="text-xs text-gray-500 w-10 text-right">{rotation}°</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Crop & Upload"}
                </button>
                <button
                  type="button"
                  onClick={closeCrop}
                  className="sm:w-32 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
