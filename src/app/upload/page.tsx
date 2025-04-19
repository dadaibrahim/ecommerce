// app/upload/page.tsx
'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed");
      }

      setImageUrl(data.url);
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Image</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="image" accept="image/*" required className="mb-4" />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6">
          <p>Preview:</p>
          <img src={imageUrl} alt="Uploaded" className="mt-2 border rounded shadow" />
        </div>
      )}
    </div>
  );
}
