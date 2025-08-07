"use client"; // We must add this to use hooks like useState, useRouter

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// We no longer need the Link component for this button

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This function contains all the logic for creating a new plan
  const handleGetStarted = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call the API endpoint to create a blank business plan
      const response = await fetch('/api/businessplan/create', {
        method: 'POST',
      });

      // If the user is not logged in, Clerk's middleware will redirect them.
      // This handles any other server-side failure.
      if (!response.ok) {
        throw new Error('Failed to start a new plan. Please try again.');
      }

      const data = await response.json();
      const { businessPlanId } = data;

      if (!businessPlanId) {
        throw new Error('Could not retrieve a new plan ID.');
      }

      // 2. Save the new ID to the browser's localStorage
      localStorage.setItem('businessPlanId', businessPlanId);

      // 3. Redirect the user to the first step of the form
      router.push('/businessname');

    } catch (err) {
      console.error("Get Started Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-start w-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          
          <div className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-700 rounded-full px-4 py-1.5 text-sm">
            <span className="text-green-400 font-bold">+</span>
            <span className="text-gray-300">FeasAI 300,000 daily users.</span>
          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-bold leading-tight text-gray-100">
            Write it and let<br/>
            <span className="text-[#22C55E]">FeasAI</span> Roast it.
          </h1>

          <p className="mt-6 text-lg text-gray-400">
            More than <span className="text-green-400">30 Million business</span> across the world
            fail, <span className="text-green-400">due to improper planning</span>, <span className="text-green-400">failure to do
            simple SWOT analysis</span>. FeasAI handles <span className="text-green-400">improper planning</span>, <span className="text-green-400">SWOT analysis</span> and more
            elegantly, while being as <span className="text-green-400">frank</span> as possible.
          </p>

          {/* --- THIS IS THE UPDATED PART --- */}
          <div className="mt-10">
            {/* The <Link> has been replaced with a <button> */}
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {/* The button text changes while loading */}
              {isLoading ? 'Preparing...' : 'Get Started'}
            </button>
            {/* This will display any errors to the user */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>

        </div>
      </div>
    </section>
  );
}