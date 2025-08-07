"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessBudgetPage() {
  const router = useRouter();

  // State for each of the financial inputs
  const [capital, setCapital] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [expectedRevenue, setExpectedRevenue] = useState("");

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

  // This function will save the final data and then redirect to the results page
  const handleGenerate = async () => {
    // Basic validation
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
      // 1. Save the final piece of data to the database
      const response = await fetch('/api/businessplan/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: businessPlanId,
          updateData: {
            // Note: We convert to numbers before sending
            businessBudget: parseInt(capital, 10),
            fundingSource: fundingSource,
            expectedRevenue: parseInt(expectedRevenue, 10),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save budget information.');
      }

      // 2. Redirect the user to the results page, passing the ID
      // The results page will use this ID to fetch the data and generate the AI report.
      router.push('/businessgoal');

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl text-gray-200 text-center">
        Lets Talk About Your Budget
      </h2>
      <p className="mt-2 text-gray-400 max-w-lg text-center">
        Financial details are essential for creating a realistic feasibility study and forecast.
      </p>

      <div className="mt-10 w-full flex flex-col gap-8">
        <div>
          <label htmlFor="capital" className="block text-lg text-left text-gray-300 mb-2">
            Initial Capital
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">USD</span>
            <input type="number" id="capital" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="50000" className="w-full bg-[#14532d]/50 backdrop-blur-sm rounded-lg p-3 pl-14 text-white placeholder-gray-400/70 outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>

        <div>
          <label htmlFor="fundingSource" className="block text-lg text-left text-gray-300 mb-2">
            Primary Funding Source
          </label>
          <div className="relative">
            <select id="fundingSource" value={fundingSource} onChange={(e) => setFundingSource(e.target.value)} className="w-full appearance-none bg-[#14532d]/50 backdrop-blur-sm rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-green-400">
              <option value="" disabled>Select a source...</option>
              <option value="personal_savings">Personal Savings</option>
              <option value="friends_family">Friends & Family</option>
              <option value="bank_loan">Bank Loan</option>
              <option value="investors">Angel Investors / VCs</option>
              <option value="crowdfunding">Crowdfunding</option>
              <option value="other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="expectedRevenue" className="block text-lg text-left text-gray-300 mb-2">
            Expected Revenue (First Year)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">USD</span>
            <input type="number" id="expectedRevenue" value={expectedRevenue} onChange={(e) => setExpectedRevenue(e.target.value)} placeholder="120000" className="w-full bg-[#14532d]/50 backdrop-blur-sm rounded-lg p-3 pl-14 text-white placeholder-gray-400/70 outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON SECTION --- */}
      <div className="mt-12">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !capital || !fundingSource || !expectedRevenue}
          className="bg-[#16A34A] text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving Final Details...' : 'Continue'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}