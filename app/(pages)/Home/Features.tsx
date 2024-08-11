import FeatureCard from "@/app/Components/FeatureCard";
import React from "react";
import { FaUpload, FaRegShareSquare } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

const features = [
  {
    title: "Seamless Uploads",
    description: "Upload images quickly and easily with just a few clicks.",
    icon: FaUpload,
  },
  {
    title: "Personalized Profile",
    description: "Customize your profile and manage your images with ease.",
    icon: FaPerson,
  },
  {
    title: "Private or Public Sharing",
    description:
      "Control visibility—keep images private or share them on the Feed.",
    icon: FaRegShareSquare,
  },
  {
    title: "Engaging Feed",
    description: "Explore public images and discover new content from others.",
    icon: MdFeedback,
  },
  {
    title: "Secure Access",
    description:
      "Log in to access your profile and ensure your content is secure.",
    icon: RiSecurePaymentFill,
  },
];

export default function Features() {
  return (
    <section className="flex flex-col justify-center items-center py-12">
      <span className="text-3xl font-whisper text-amber-600">Our Features</span>
      <h2 className="text-3xl lg:text-4xl font-bold tracking-wide mb-8">
        Our Features
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {features.map((data, index) => (
          <FeatureCard
            title={data.title}
            description={data.description}
            icon={data.icon}
            key={index}
          />
        ))}
      </div>
    </section>
  );
}
