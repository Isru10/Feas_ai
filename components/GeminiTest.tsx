"use client";

import { useState } from "react";

export default function GeminiPage() {
  // State to hold the user's input
  const [prompt, setPrompt] = useState("");
  // State to hold the AI's response
  const [result, setResult] = useState("");
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any errors
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult("");

    try {
      // Call our own backend API
        const response = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.text);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold text-center text-white">Ask Gemini AI</h1>
      
      <form onSubmit={handleSubmit} className="mt-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full p-3 bg-[#14532d]/50 rounded-lg border border-green-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Ask anything... for example, 'What are the key challenges for a new coffee shop?'"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Response"}
        </button>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 p-4 bg-green-950/40 border border-green-800 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Response:</h2>
          {/* Using <pre> preserves whitespace and line breaks from the AI's response */}
          <pre className="text-gray-300 whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}