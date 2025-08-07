"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AudiencePage() {
  const router = useRouter();
  
  // State for the audience description text
  const [audienceDescription, setAudienceDescription] = useState("");

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

  // Function to save the data and move to the next step
  const handleContinue = async () => {
    if (!audienceDescription.trim()) {
      setError("Please describe your target audience.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // We use the same update API endpoint
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { businessAudience: audienceDescription },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save target audience.');
      }

      // If successful, redirect to the next step
      router.push('/businessdesc');

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We add a wrapper to contain all elements and center them
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl text-gray-200 text-center">
        Who is your target audience?
      </h2>
      <p className="mt-2 text-gray-400 max-w-md text-center">
        Describe your customers. You can list multiple groups separated by commas.
      </p>

      <div className="mt-12 w-full">
        <div className="relative w-full h-24 bg-[#14532d]/50 backdrop-blur-sm rounded-[50px] flex items-center justify-center p-4 shadow-lg">
          <input
            type="text"
            value={audienceDescription}
            onChange={(e) => setAudienceDescription(e.target.value)}
            placeholder="e.g., Teenagers, University Students, Young Professionals"
            className="w-[90%] bg-transparent text-white text-xl text-center placeholder-gray-400/70 outline-none border-b-2 border-gray-400/50 focus:border-white transition-colors duration-300"
            autoFocus
          />
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON SECTION --- */}
      <div className="mt-12">
        {/* The <Link> has been replaced with a <button> */}
        <button
          onClick={handleContinue}
          disabled={isLoading || !audienceDescription}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}