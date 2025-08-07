"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessNamePage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  
  // State to hold the ID we get from localStorage
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
      // If there's no ID, the user probably landed here by mistake.
      // Redirect them to the start to create a new plan.
      console.error("No businessPlanId found in localStorage.");
      router.push('/'); 
    }
  }, [router]);

  const handleContinue = async () => {
    // Basic validation
    if (!businessName.trim()) {
      setError("Business name cannot be empty.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our new update API endpoint
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { businessName: businessName }, // Send only the data for this step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business name.');
      }

      // If successful, redirect to the next step
      router.push('/businessindustry');

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We add a wrapper div to contain all elements including the new button
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl text-gray-200 leading-tight italic text-center">
        Alright lets start with the name of
        <br />
        your pathetic business
      </h1>

      <div className="mt-12 w-full">
        <div className="relative w-full h-24 bg-[#14532d]/50 backdrop-blur-sm rounded-[50px] flex items-center justify-center p-4 shadow-lg">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-[90%] bg-transparent text-white text-xl text-center placeholder-gray-400/70 outline-none border-b-2 border-gray-400/50 focus:border-white transition-colors duration-300"
            autoFocus
          />
        </div>
      </div>

      {/* --- THIS IS THE NEW BUTTON SECTION --- */}
      <div className="mt-12">
        <button
          onClick={handleContinue}
          disabled={isLoading || !businessName}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}