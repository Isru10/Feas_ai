"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessDescriptionPage() {
  const router = useRouter();
  
  // State for the description textarea
  const [description, setDescription] = useState("");

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
    if (!description.trim()) {
      setError("Please provide a description for your business.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the same update API endpoint
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { businessDescription: description },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business description.');
      }

      // If successful, redirect to the next step
      router.push('/businessbudget'); // Redirecting to the budget page

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We add a wrapper to contain all elements and center them
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl text-gray-200 text-center">
        Now, describe your business.
      </h2>
      <p className="mt-2 text-gray-400 max-w-md text-center">
        What do you do? Who are your customers? The more detail, the better the results.
      </p>

      <div className="mt-12 w-full">
        <div className="relative w-full h-48 bg-[#14532d]/50 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A cozy neighborhood cafe that sells artisanal coffee and locally baked pastries to young professionals and families."
            className="w-full h-full bg-transparent text-white text-lg placeholder-gray-400/70 outline-none resize-none p-2"
            autoFocus
          />
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON SECTION --- */}
      <div className="mt-12">
        {/* The <Link> has been replaced with a <button> */}
        <button
          onClick={handleContinue}
          disabled={isLoading || !description}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}