"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaTrash } from 'react-icons/fa';

interface AnimalUpload {
  imageUrl: string;
  analysis: {
    species: string;
    breed: string;
    country: string;
    habitat: string;
    specifications: string;
    common_problems: string;
    fun_facts: string;
  };
  timestamp: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<AnimalUpload[]>([]);

  useEffect(() => {
    if (user) {
      fetchUploads();
      console.log(uploads)
    }
  }, [user]);

  const fetchUploads = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUploads(userDoc.data().animalUploads || []);
    }
  };

  const handleDelete = async (upload: AnimalUpload) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      animalUploads: arrayRemove(upload),
    });
    setUploads(uploads.filter((item) => item !== upload));
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Animal Uploads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uploads.length > 0 ? (
          uploads.map((upload, index) => (
            <div key={index} className="relative p-4 border rounded-lg shadow-md bg-white">
              <img 
                src={upload.imageUrl} 
                alt="Uploaded animal" 
                className="mb-2 w-full h-48 object-cover rounded-md" 
              />
              <p className="text-sm text-gray-600">{new Date(upload.timestamp).toLocaleString()}</p>
              <div className="mt-2 text-gray-800">
                <p><strong>Species:</strong> {upload.analysis.species}</p>
                <p><strong>Breed:</strong> {upload.analysis.breed}</p>
                <p><strong>Country:</strong> {upload.analysis.country}</p>
                <p><strong>Habitat:</strong> {upload.analysis.habitat}</p>
                <p><strong>Specifications:</strong> {upload.analysis.specifications}</p>
                <p><strong>Common Problems:</strong> {upload.analysis.common_problems}</p>
                <p><strong>Fun Facts:</strong> {upload.analysis.fun_facts}</p>
              </div>
              <button
                onClick={() => handleDelete(upload)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label="Delete"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No uploads found. Upload an animal image to see it here.
          </div>
        )}
      </div>
    </div>
  );
}
