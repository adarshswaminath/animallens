"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  doc,
  setDoc,
  arrayUnion,
  addDoc,
  collection,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiUpload, FiCamera } from "react-icons/fi";

import {
  FaDog,
  FaGlobeAmericas,
  FaTree,
  FaClipboardList,
  FaHeartbeat,
  FaLightbulb,
} from "react-icons/fa";

interface AnimalAnalysis {
  species: string;
  breed: string;
  country: string;
  habitat: string;
  specifications: string;
  common_problems: string;
  fun_facts: string;
}

const animalUploadsCollection = collection(db, "animalUploads");

export default function ImageUpload() {
  const { user } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnimalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Allowed file types
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid image file (PNG, JPG, JPEG)");
        setImage(null);
        setPreview(null);
        return;
      }
      if (file.size > 1028576) {
        setError("File size should be less than 1MB");
        setImage(null);
        setPreview(null);
        return;
      }
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image || !user) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Upload image to Firebase Storage
      const storageRef = ref(
        storage,
        `animal_images/${user.uid}/${Date.now()}-${image.name}`
      );
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Convert image to base64
      const base64Image = await convertToBase64(image);

      // 3. Send base64 image data to API for analysis
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Image,
          mimeType: image.type,
        }),
      });
      const result = await response.json();

      if (result.success) {
        // 4. Process the analysis result
        let analysisData = result.message;
        analysisData = analysisData.replace(/```json|```/g, "").trim();
        const parsedAnalysis: AnimalAnalysis = JSON.parse(analysisData);

        // 5. Validate the response
        const isInvalidResponse = Object.values(parsedAnalysis).every(
          (value) =>
            typeof value === "string" &&
            (value.trim().toLowerCase() === "n/a" ||
              value.trim().toLowerCase() === "none" ||
              value.trim() === "")
        );

        console.log("Parsed Analysis:", parsedAnalysis);
        console.log("Is Invalid Response:", isInvalidResponse);

        if (isInvalidResponse) {
          setError("Please upload a valid animal image.");
          setAnalysis(null);
        } else {
          // 6. Prepare upload data
          const uploadData = {
            imageUrl: downloadURL,
            analysis: parsedAnalysis,
            timestamp: new Date().toISOString(),
            userId: user.uid,
          };

          // 7. Store data in Firestore
          await addDoc(animalUploadsCollection, uploadData);
          await storeAnalysisInFirebase(uploadData);

          // 8. Update state with analysis results
          setAnalysis(parsedAnalysis);
          setError(null);
        }
      } else {
        setError(result.message || "Analysis failed");
      }
    } catch (error) {
      setError("Error processing image. Please try again with another image.");
      console.error("Error processing image:", error);
    }
    setLoading(false);
  };

  // Helper function to convert File to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const storeAnalysisInFirebase = async (uploadData: any) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        animalUploads: arrayUnion(uploadData),
      },
      { merge: true }
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Animal Image Analyzer
          </h1>
          <div className="mb-8">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-72 border-3 border-dashed border-[#FFE7CF] rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiCamera className="w-16 h-16 mb-4 text-amber-200" />
                  <p className="mb-2 text-lg text-gray-900">
                    <span className="font-semibold text-gray-900">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-sm text-gray-600">PNG, JPG, or JPEG</p>
                  <p className="text-sm mt-3 text-gray-900">
                    File size should be less than 1MB
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/jpg"
              />
            </label>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            onClick={handleUpload}
            disabled={!image || loading}
            className={`w-full py-4 px-6 flex items-center justify-center  rounded-xl transition-all duration-300 ${
              !image || loading
                ? "bg-gray-900 cursor-not-allowed text-white"
                : "bg-[#FFE7CF] hover:bg-[#FFD7AF] shadow-md hover:shadow-lg text-gray-900"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FiUpload className="w-6 h-6 mr-2" />
            )}
            <span className="text-lg font-semibold">
              {loading ? "Analyzing..." : "Upload and Analyze"}
            </span>
          </button>
        </div>
        {analysis && (
          <div className="bg-[#FFE7CF] p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Animal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(analysis) as Array<keyof AnimalAnalysis>).map(
                (key) => {
                  return (
                    <div
                      key={key}
                      className="bg-white p-6 rounded-xl shadow-md flex items-start hover:shadow-lg transition-shadow duration-300"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 capitalize mb-2">
                          {key.replace("_", " ")}
                        </h3>
                        <p className="text-gray-600">{analysis[key]}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
