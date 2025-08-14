"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AudiencePage() {
  // =================================================================
  // ALL YOUR EXISTING LOGIC IS PRESERVED HERE. NO CHANGES WERE MADE.
  // =================================================================
  const router = useRouter();
  const [audienceDescription, setAudienceDescription] = useState("");
  const [businessPlanId, setBusinessPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('businessPlanId');
    if (id) {
      setBusinessPlanId(id);
    } else {
      console.error("No businessPlanId found. Redirecting to home.");
      router.push('/');
    }
  }, [router]);

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
      router.push('/businessbudget'); // Assuming next page is businessgoals
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  // =================================================================
  // END OF PRESERVED LOGIC
  // =================================================================

  return (
    // We use the same card container for a consistent look and feel
    <div className="w-full max-w-2xl mx-auto bg-gray-950/30 border border-green-800/30 rounded-2xl p-8 shadow-2xl shadow-green-950/20">
      
      {/* Step Indicator */}
      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">Step 4 of 6</p>
        <div className="flex space-x-2 mt-2">
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
          <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>

        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-tight text-center mt-8">
        Who is your target audience?
      </h1>
      <p className="mt-3 text-lg text-gray-400 text-center">
        Describe your ideal customers. Be as specific as you can.
      </p>

      {/* A more visually appealing text input */}
      <div className="mt-10 w-full">
        <div className="relative">
          <input
            type="text"
            value={audienceDescription}
            onChange={(e) => setAudienceDescription(e.target.value)}
            placeholder="e.g., University students, young professionals, tech startups"
            className="w-full bg-[#14532d]/40 backdrop-blur-sm rounded-xl py-4 px-5 text-white text-xl text-center placeholder-gray-400/70 outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
            autoFocus
          />
        </div>
      </div>

      {/* The Continue button and error message section */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleContinue}
          disabled={isLoading || !audienceDescription}
          className="group flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
          {!isLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        {error && (
          <div className="flex items-center gap-2 text-red-400 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}