"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The list of industries remains the same
const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Retail", "Agriculture", "Real Estate",
  "Education", "Entertainment", "Manufacturing", "Logistics", "Hospitality", "Consulting",
];

export default function BusinessIndustryPage() {
  const router = useRouter();
  
  // State for the selected industries
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  // State to hold the ID from localStorage
  const [businessPlanId, setBusinessPlanId] = useState<string | null>(null);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When the component mounts, get the ID from localStorage
  useEffect(() => {
    const id = localStorage.getItem('businessPlanId');
    if (id) {
      setBusinessPlanId(id);
    } else {
      console.error("No businessPlanId found. Redirecting to home.");
      router.push('/'); 
    }
  }, [router]);

  // Function to handle selecting/deselecting an industry
  const handleSelectIndustry = (industry: string) => {
    setSelectedIndustries((currentSelected) => {
      if (currentSelected.includes(industry)) {
        return currentSelected.filter((item) => item !== industry);
      }
      return [...currentSelected, industry];
    });
  };

  // Function to save the data and move to the next step
  const handleContinue = async () => {
    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // We'll join the array into a single string to save in the database
    const industriesString = selectedIndustries.join(', ');

    try {
      // We use the same update API endpoint
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { businessIndustry: industriesString },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save selected industries.');
      }

      // If successful, redirect to the next step
      router.push('/businessaudience');

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We add a wrapper to contain all elements and center them
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl text-gray-200 text-center">
        What industry is your business in?
      </h2>
      <p className="mt-2 text-gray-400 text-center">
        You can select multiple options if needed.
      </p>

      <div className="mt-12 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
        {INDUSTRIES.map((industry) => {
          const isSelected = selectedIndustries.includes(industry);
          return (
            <button
              key={industry}
              onClick={() => handleSelectIndustry(industry)}
              className={`
                px-4 py-3 rounded-full text-center font-bold transition-all duration-200 transform
                ${isSelected 
                  ? 'bg-white text-green-900 scale-105' 
                  : 'bg-[#16A34A] text-white hover:bg-[#15803d]'}
              `}
            >
              {industry}
            </button>
          );
        })}
      </div>

      {/* --- THIS IS THE NEW BUTTON SECTION --- */}
      <div className="mt-12">
        <button
          onClick={handleContinue}
          disabled={isLoading || selectedIndustries.length === 0}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}