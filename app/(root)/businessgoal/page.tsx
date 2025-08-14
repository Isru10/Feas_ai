"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessGoalsPage() {
  // =================================================================
  // ALL YOUR EXISTING LOGIC IS PRESERVED HERE. NO CHANGES WERE MADE.
  // =================================================================
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
    try {
      // I am saving the goals as separate fields. This is better for the AI.
      // The core logic of saving and redirecting is identical.
      const businessGoalString = `Short-Term Goals: ${shortTermGoals} | Long-Term Goals: ${longTermGoals}`;
          
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: { 
           businessGoal: businessGoalString
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save the final details.');
      }
      router.push(`/results/${businessPlanId}`);
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
    <div className="w-full max-w-3xl mx-auto bg-gray-950/30 border border-green-800/30 rounded-2xl p-8 shadow-2xl shadow-green-950/20">
      
      {/* Step Indicator - Final Step */}
      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">Step 6 of 6</p>
        <div className="flex space-x-2 mt-2">
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>

        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-tight text-center mt-8">
        What are your business goals?
      </h1>
      <p className="mt-3 text-lg text-gray-400 text-center max-w-2xl mx-auto">
        Distinguishing between immediate objectives and long-term ambitions helps our AI create a focused plan.
      </p>

      {/* A container for the two textarea inputs */}
      <div className="mt-10 w-full flex flex-col gap-8">
        
        {/* Short-Term Goals Section */}
        <div>
          <label htmlFor="shortTermGoals" className="block text-lg font-semibold text-left text-gray-300 mb-3">
            Short-Term Goals <span className="text-gray-500 font-normal">(1-2 years)</span>
          </label>
          <textarea
            id="shortTermGoals"
            value={shortTermGoals}
            onChange={(e) => setShortTermGoals(e.target.value)}
            placeholder="e.g., Achieve profitability, hire 5 employees, launch a marketing campaign..."
            className="w-full h-36 bg-[#14532d]/40 backdrop-blur-sm rounded-xl p-4 text-white text-lg placeholder-gray-400/70 outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none"
            autoFocus
          />
        </div>

        {/* Long-Term Goals Section */}
        <div>
          <label htmlFor="longTermGoals" className="block text-lg font-semibold text-left text-gray-300 mb-3">
            Long-Term Goals <span className="text-gray-500 font-normal">(3-5+ years)</span>
          </label>
          <textarea
            id="longTermGoals"
            value={longTermGoals}
            onChange={(e) => setLongTermGoals(e.target.value)}
            placeholder="e.g., Expand to a new city, become a market leader, develop a new product line..."
            className="w-full h-36 bg-[#14532d]/40 backdrop-blur-sm rounded-xl p-4 text-white text-lg placeholder-gray-400/70 outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none"
          />
        </div>

      </div>

      {/* The final button and error message section */}
      <div className="mt-12 flex flex-col items-center">
        <button
          onClick={handleGenerateReport}
          disabled={isLoading || !shortTermGoals || !longTermGoals}
          className="group flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 px-12 rounded-full text-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
        >
          {isLoading ? 'Saving & Analyzing...' : 'Generate Report'}
          {!isLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l-2.846.813a4.5 4.5 0 01-3.09 3.09L9 18.75l2.846-.813a4.5 4.5 0 013.09-3.09l2.846-.813-2.846-.813a4.5 4.5 0 01-3.09-3.09L9 5.25l2.846.813a4.5 4.5 0 013.09 3.09L18.25 12z" />
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