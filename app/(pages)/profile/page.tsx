"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface AnimalUpload {
  imageUrl: string;
  analysis: string;
  timestamp: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<AnimalUpload[]>([]);

  useEffect(() => {
    if (user) {
      fetchUploads();
    }
  }, [user]);

  const fetchUploads = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    console.log(userDoc)
    if (userDoc.exists()) {
      setUploads(userDoc.data().animalUploads || []);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Animal Uploads</h1>
      {uploads.map((upload, index) => (
        <div key={index} className="mb-6 p-4 border rounded">
          <img src={upload.imageUrl} alt="Uploaded animal" className="mb-2 max-w-xs" />
          <p className="text-sm text-gray-600">{new Date(upload.timestamp).toLocaleString()}</p>
          <p className="mt-2">{upload.analysis}</p>
        </div>
      ))}
    </div>
  );
}