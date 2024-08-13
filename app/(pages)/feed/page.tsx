"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import Image from "next/image";
import { FaSearch, FaPaw, FaGlobeAmericas, FaTree, FaInfoCircle, FaExclamationTriangle, FaLightbulb, FaTimes } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUpload, setSelectedUpload] = useState<AnimalUpload | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async (search: string = "") => {
    setLoading(true);
    try {
      let q = query(collection(db, "animalUploads"), orderBy("timestamp", "desc"), limit(20));

      if (search) {
        q = query(q, where("analysis.species", ">=", search), where("analysis.species", "<=", search + "\uf8ff"));
      }

      const querySnapshot = await getDocs(q);
      const fetchedUploads = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AnimalUpload));
      setUploads(fetchedUploads);
    } catch (err) {
      console.error("Error fetching uploads:", err);
      setError("Failed to load uploads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUploads(searchTerm);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen ">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">Animal Discovery Feed</h1>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for animals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-14 rounded-full border-2 border-gray-300 focus:outline-none focus:border-amber-600 text-lg"
          />
          <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-500 hover:text-amber-600 transition-colors text-xl" />
          </button>
        </div>
      </form>

      {uploads.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No uploads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-64">
                <Image src={upload.imageUrl} alt={upload.analysis.species} layout="fill" objectFit="cover" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{upload.analysis.species}</h2>
                <p className="text-gray-600 mb-4">Breed: {upload.analysis.breed}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaGlobeAmericas className="mr-2" />
                  <span>{upload.analysis.country}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaTree className="mr-2" />
                  <span>{upload.analysis.habitat}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{new Date(upload.timestamp).toLocaleString()}</p>
                <button
                  onClick={() => setSelectedUpload(upload)}
                  className="mt-4 bg-amber-500 text-white py-2 px-4 rounded-full hover:bg-amber-600 transition-colors w-full"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedUpload(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors text-2xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-4xl font-bold mb-6">{selectedUpload.analysis.species}</h2>
            <Image
              src={selectedUpload.imageUrl}
              alt={selectedUpload.analysis.species}
              width={400}
              height={300}
              objectFit="cover"
              className="rounded-lg mb-6 mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaPaw className="mr-2" /> Breed</h3>
                <p className="text-gray-700">{selectedUpload.analysis.breed}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaGlobeAmericas className="mr-2" /> Country</h3>
                <p className="text-gray-700">{selectedUpload.analysis.country}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaTree className="mr-2" /> Habitat</h3>
                <p className="text-gray-700">{selectedUpload.analysis.habitat}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaInfoCircle className="mr-2" /> Specifications</h3>
                <p className="text-gray-700">{selectedUpload.analysis.specifications}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaExclamationTriangle className="mr-2" /> Common Problems</h3>
                <p className="text-gray-700">{selectedUpload.analysis.common_problems}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center text-lg"><FaLightbulb className="mr-2" /> Fun Facts</h3>
                <p className="text-gray-700">{selectedUpload.analysis.fun_facts}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedUpload(null)}
              className="mt-8 bg-amber-500 text-white py-2 px-4 rounded-full hover:bg-amber-600 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
