"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessGoalsPage() {
  const router = useRouter();

  const [shortTermGoals, setShortTermGoals] = useState("");
  const [longTermGoals, setLongTermGoals] = useState("");
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

  // This is the final action before seeing the results.
  const handleGenerateReport = async () => {
    if (!shortTermGoals.trim() || !longTermGoals.trim()) {
      setError("Please describe both your short-term and long-term goals.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const combinedGoals = `Short-Term: ${shortTermGoals} \n\nLong-Term: ${longTermGoals}`;

    try {
      // 1. Save this final piece of data to the database
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { businessGoal: combinedGoals },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the final details.');
      }

      // 2. Redirect to the results page, passing the unique ID.
      // The results page will use this ID to trigger the AI generation.
      router.push(`/results/${businessPlanId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl text-gray-200 text-center">
        What are your business goals?
      </h2>
      <p className="mt-2 text-gray-400 max-w-lg text-center">
        Distinguishing between your immediate objectives and long-term ambitions helps in creating a focused plan.
      </p>

      <div className="mt-10 w-full flex flex-col gap-8">
        <div>
          <h3 className="text-xl text-left text-gray-300 mb-3">Short-Term Goals (1-2 years)</h3>
          <div className="relative w-full h-32 bg-[#14532d]/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <textarea
              value={shortTermGoals}
              onChange={(e) => setShortTermGoals(e.target.value)}
              placeholder="e.g., Achieve profitability, hire 5 employees, launch a marketing campaign..."
              className="w-full h-full bg-transparent text-white text-lg placeholder-gray-400/70 outline-none resize-none p-2"
              autoFocus
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl text-left text-gray-300 mb-3">Long-Term Goals (3-5+ years)</h3>
          <div className="relative w-full h-32 bg-[#14532d]/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <textarea
              value={longTermGoals}
              onChange={(e) => setLongTermGoals(e.target.value)}
              placeholder="e.g., Expand to a new city, become a market leader, develop a new product line..."
              className="w-full h-full bg-transparent text-white text-lg placeholder-gray-400/70 outline-none resize-none p-2"
            />
          </div>
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON SECTION --- */}
      <div className="mt-12">
        <button
          onClick={handleGenerateReport} // The function name is updated for clarity
          disabled={isLoading || !shortTermGoals || !longTermGoals}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {/* The button text is updated to reflect the final action */}
          {isLoading ? 'Saving...' : 'Generate Report'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}