// app/admin/import-pdf/page.tsx
'use client';
import { useState } from 'react';

export default function ImportPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/parse-pdf', { method: 'POST', body: formData });
    const json = await res.json();
    setGeneratedPackage(json.data);
    setLoading(false);
  };

  const handleConfirm = async () => {
    // POST generatedPackage to your existing /api/packages endpoint
    await fetch('/api/packages', { method: 'POST', body: JSON.stringify(generatedPackage) });
    // redirect to package list
  };

  return (
    <div>
      <h1>Import Safari from PDF</h1>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file || loading}>Analyze PDF with AI</button>

      {generatedPackage && (
        <div>
          <h2>Preview AI-Generated Package</h2>
          {/* Render key fields (title, description, etc.) and show images */}
          <button onClick={handleConfirm}>Confirm & Publish to Website</button>
        </div>
      )}
    </div>
  );
}