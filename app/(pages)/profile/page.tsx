"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaTrash } from 'react-icons/fa';
import ProfileData from './ProfileData';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalUpload | null>(null);

  useEffect(() => {
    if (user) {
      fetchUploads();
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

  const openModal = (upload: AnimalUpload) => {
    setSelectedAnimal(upload);
    const modal = document.getElementById('animal-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  const closeModal = () => {
    setSelectedAnimal(null);
    const modal = document.getElementById('animal-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  };

  if (!user) return <div className="text-center text-gray-700">Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <ProfileData totalUploads={uploads?.length} />
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Upload History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {uploads.length > 0 ? (
          uploads.map((upload, index) => (
            <motion.div
              key={index}
              className="relative p-4 border border-gray-200 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => openModal(upload)}
            >
              <Image
                src={upload.imageUrl}
                alt="Uploaded animal"
                className="w-full h-48 object-cover rounded-md"
                width={400}
                height={300}
              />
              <div className="text-center mt-4">
                <p className="text-xl font-semibold text-gray-800">{upload.analysis.species}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(upload);
                }}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                aria-label="Delete"
              >
                <FaTrash size={20} />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No uploads found. Upload an animal image to see it here.
          </div>
        )}
      </div>

      {/* Modal for displaying animal details */}
      <div id="animal-modal" className="fixed z-50 inset-0 hidden bg-black bg-opacity-50 items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto">
          {selectedAnimal && (
            <div>
              <Image
                src={selectedAnimal.imageUrl}
                alt="Animal"
                width={500}
                height={400}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedAnimal.analysis.species}
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Breed:</strong> {selectedAnimal.analysis.breed}</p>
                  <p><strong>Country:</strong> {selectedAnimal.analysis.country}</p>
                  <p><strong>Habitat:</strong> {selectedAnimal.analysis.habitat}</p>
                  <p><strong>Specifications:</strong> {selectedAnimal.analysis.specifications}</p>
                  <p><strong>Common Problems:</strong> {selectedAnimal.analysis.common_problems}</p>
                  <p><strong>Fun Facts:</strong> {selectedAnimal.analysis.fun_facts}</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
