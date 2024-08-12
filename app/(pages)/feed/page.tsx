"use client"

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Image from 'next/image';

interface AnimalAnalysis {
  species: string;
  breed: string;
  country: string;
  habitat: string;
  specifications: string;
  common_problems: string;
  fun_facts: string;
}

interface AnimalUpload {
  id: string;
  imageUrl: string;
  analysis: AnimalAnalysis;
  timestamp: string;
  userId: string;
}

export default function PublicFeed() {
  const [uploads, setUploads] = useState<AnimalUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const q = query(collection(db, 'animalUploads'), orderBy('timestamp', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        const fetchedUploads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnimalUpload));
        setUploads(fetchedUploads);
      } catch (err) {
        console.error("Error fetching uploads:", err);
        setError("Failed to load uploads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recent Animal Uploads</h1>
      {uploads.length === 0 ? (
        <p className="text-center text-gray-500">No uploads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((upload) => (
            <div key={upload.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src={upload.imageUrl} 
                  alt={upload.analysis.species} 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{upload.analysis.species}</h2>
                <p className="text-gray-600 mb-2">Breed: {upload.analysis.breed}</p>
                <p className="text-sm text-gray-500">{new Date(upload.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}