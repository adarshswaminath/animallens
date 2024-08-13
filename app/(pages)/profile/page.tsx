"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc, arrayRemove, query, where, getDocs, deleteDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import ProfileData from "./ProfileData";

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
  const [selectedUpload, setSelectedUpload] = useState<AnimalUpload | null>(null);

  useEffect(() => {
    if (user) {
      fetchUploads();
    }
  }, [user]);

  const fetchUploads = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUploads(userDoc.data().animalUploads || []);
    }
  };

  const handleDelete = async (upload: AnimalUpload) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      animalUploads: arrayRemove(upload),
    });
    // Remove from public collection
    const animalUploadsCollection = collection(db, "animalUploads");
    const q = query(
      animalUploadsCollection,
      where("imageUrl", "==", upload.imageUrl)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setUploads(uploads.filter((item) => item !== upload));
  };

  if (!user)
    return (
      <p className="text-center text-xl mt-8 min-h-screen">
        Please log in to view your profile.
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-12">
        <ProfileData totalUploads={uploads?.length} />
      </div>
      <h1 className="text-3xl font-bold mb-6">Your Animal Uploads</h1>
      {uploads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={upload.imageUrl}
                alt={`Animal ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedUpload(upload)}
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(upload.timestamp).toLocaleString()}
                </p>
                <p className="font-semibold">{upload.analysis.species}</p>
              </div>
              <button
                onClick={() => handleDelete(upload)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl mt-8">
          No uploads found. Upload an animal image to see it here.
        </p>
      )}

      {selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedUpload.analysis.species}
                </h2>
                <button
                  onClick={() => setSelectedUpload(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <Image
                src={selectedUpload.imageUrl}
                alt={selectedUpload.analysis.species}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Breed"
                  value={selectedUpload.analysis.breed}
                />
                <DetailItem
                  label="Country"
                  value={selectedUpload.analysis.country}
                />
                <DetailItem
                  label="Habitat"
                  value={selectedUpload.analysis.habitat}
                />
                <DetailItem
                  label="Specifications"
                  value={selectedUpload.analysis.specifications}
                />
                <DetailItem
                  label="Common Problems"
                  value={selectedUpload.analysis.common_problems}
                />
                <DetailItem
                  label="Fun Facts"
                  value={selectedUpload.analysis.fun_facts}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}