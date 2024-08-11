import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="card max-w-sm p-6 rounded-xl bg-[#FEFAF8] hover:bg-[#FFE7CF] hover:shadow-md transition-shadow duration-300 ease-in-out">
      <Icon className="text-3xl text-amber-600 mb-4" />
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

