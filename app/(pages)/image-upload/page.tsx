"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function ImageUpload() {
  const { user } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!image || !user) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let resultText = await response.text();
      resultText = resultText.replace(/```json|```/g, '').trim();

      const result = JSON.parse(resultText);

      // Store the image URL and cleaned analysis data in Firebase
      await storeAnalysisInFirebase(preview!, result);

      console.log('Upload and analysis stored successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setLoading(false);
  };

  const storeAnalysisInFirebase = async (imageUrl: string, analysis: object) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(
      userDocRef,
      {
        animalUploads: arrayUnion({
          imageUrl,
          analysis,
          timestamp: new Date().toISOString(),
        }),
      },
      { merge: true }
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Animal Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {preview && <img src={preview} alt="Preview" className="mb-4 max-w-xs" />}
      <button
        onClick={handleUpload}
        disabled={!image || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Upload and Analyze'}
      </button>
    </div>
  );
}
