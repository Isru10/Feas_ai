"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessBudgetPage() {
  // =================================================================
  // YOUR EXISTING LOGIC IS PRESERVED HERE.
  // =================================================================
  const router = useRouter();
  const [capital, setCapital] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [expectedRevenue, setExpectedRevenue] = useState("");
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

  // --- THIS IS THE ONLY FUNCTION THAT HAS BEEN MODIFIED ---
  const handleContinue = async () => {
    if (!capital || !fundingSource || !expectedRevenue) {
      setError("Please fill out all financial details.");
      return;
    }
    if (!businessPlanId) {
      setError("Session ID is missing. Please start over.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1. We create a single, well-formatted string from the state variables.
      const businessBudgetString = `Initial Capital: ${capital} USD | Funding Source: ${fundingSource} | Expected First-Year Revenue: ${expectedRevenue} USD`;

      // 2. We send this single string to the `businessBudget` field.
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: {
            businessBudget: businessBudgetString, // This now sends the combined string
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save budget information.');
      }
      router.push('/businessgoal');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  // =================================================================
  // END OF LOGIC SECTION
  // =================================================================

  return (
    // The beautified UI remains the same.
    <div className="w-full max-w-2xl mx-auto bg-gray-950/30 border border-green-800/30 rounded-2xl p-8 shadow-2xl shadow-green-950/20">
      
      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">Step 4 of 5</p>
        <div className="flex space-x-2 mt-2">
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-tight text-center mt-8">
        Let as Talk Budget
      </h1>
      <p className="mt-3 text-lg text-gray-400 text-center">
        Realistic financials are key to a viable plan.
      </p>

      <div className="mt-10 w-full flex flex-col gap-6">
        
        <div>
          <label htmlFor="capital" className="block text-sm font-medium text-gray-300 mb-2">
            Initial Capital (USD)
          </label>
          <input
            type="number"
            id="capital"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full bg-[#14532d]/40 backdrop-blur-sm rounded-xl py-3 px-4 text-white text-lg placeholder-gray-400/70 outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
          />
        </div>

        <div>
          <label htmlFor="fundingSource" className="block text-sm font-medium text-gray-300 mb-2">
            Primary Funding Source
          </label>
          <div className="relative">
            <select
              id="fundingSource"
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value)}
              className={`w-full appearance-none bg-[#14532d]/40 backdrop-blur-sm rounded-xl py-3 px-4 text-lg outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${fundingSource ? 'text-white' : 'text-gray-400/70'}`}
            >
              <option value="" disabled>Select a source...</option>
              <option value="personal_savings">Personal Savings</option>
              <option value="friends_family">Friends & Family</option>
              <option value="bank_loan">Bank Loan</option>
              <option value="investors">Angel Investors / VCs</option>
              <option value="crowdfunding">Crowdfunding</option>
              <option value="other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="expectedRevenue" className="block text-sm font-medium text-gray-300 mb-2">
            Expected Revenue - First Year (USD)
          </label>
          <input
            type="number"
            id="expectedRevenue"
            value={expectedRevenue}
            onChange={(e) => setExpectedRevenue(e.target.value)}
            placeholder="e.g., 120000"
            className="w-full bg-[#14532d]/40 backdrop-blur-sm rounded-xl py-3 px-4 text-white text-lg placeholder-gray-400/70 outline-none border-2 border-transparent focus:border-green-500 focus:ring-2 focus-ring-green-500/50 transition-all duration-300"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleContinue}
          disabled={isLoading || !capital || !fundingSource || !expectedRevenue}
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