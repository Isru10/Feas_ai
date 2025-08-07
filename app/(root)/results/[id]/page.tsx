"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// Define the data structure for the visuals
interface AnalysisData {
  overallScore: number;
  keyMetrics: {
    marketPotential: number;
    financialViability: number;
    innovationFactor: number;
  };
  reportMarkdown: string; // The report is now part of the main data object
}

export default function ResultsPage() {
  const params = useParams();
  const businessPlanId = params.id as string;
  
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessPlanId) {
      setError("No business plan ID found.");
      setIsLoading(false);
      return;
    }

    const generateAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/generate-analysis', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ businessPlanId }) 
        });

        if (!response.ok) {
          throw new Error('Failed to generate analysis. The AI may be experiencing high load. Please try again later.');
        }

        const data: AnalysisData = await response.json();
        setAnalysis(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateAnalysis();
  }, [businessPlanId]);
  
  const handleDownload = () => {
    if (!analysis) return;
    const blob = new Blob([analysis.reportMarkdown], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'FeasAI_Analysis_Report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- UI Components are here for simplicity and directness ---

  if (isLoading) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mb-6"></div>
        <h2 className="text-3xl font-bold text-white">FeasAI is Roasting Your Idea...</h2>
        <p className="mt-4 text-lg text-gray-400">This can take up to a minute. Great analysis requires great focus.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-900/20 p-8 rounded-lg border border-red-700">
        <h2 className="text-3xl font-bold text-red-400">Analysis Failed</h2>
        <p className="mt-4 text-lg text-red-300">{error}</p>
        <Link href="/" className="mt-6 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-500 transition-colors">Start Over</Link>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Feasibility Analysis Report</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column (Main Report) */}
          <main className="lg:col-span-2 bg-green-950/20 p-8 rounded-2xl border border-green-800/50">
            <ReactMarkdown
              components={{
                h2: ({...props}) => <h2 className="text-2xl font-bold mt-5 mb-3 text-white border-b border-green-800 pb-2" {...props} />,
                strong: ({...props}) => <strong className="font-bold text-green-400" {...props} />,
                p: ({...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4" {...props} />,
              }}
            >
              {analysis.reportMarkdown}
            </ReactMarkdown>
          </main>
          
          {/* Right Sidebar (Visuals) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-900/50 border border-gray-700 rounded-2xl p-6 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Overall Score</h3>
                <div className="flex items-center">
                  {[...Array(Math.floor(analysis.overallScore))].map((_, i) => <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  <span className="ml-2 text-white font-bold text-lg">{analysis.overallScore.toFixed(1)} / 5.0</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
                <div className="space-y-4">
                    <div className="w-full">
                        <div className="flex justify-between mb-1"><span className="text-base font-medium text-gray-300">Market Potential</span><span className="text-sm font-medium text-white">{analysis.keyMetrics.marketPotential}%</span></div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${analysis.keyMetrics.marketPotential}%` }}></div></div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between mb-1"><span className="text-base font-medium text-gray-300">Financial Viability</span><span className="text-sm font-medium text-white">{analysis.keyMetrics.financialViability}%</span></div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${analysis.keyMetrics.financialViability}%` }}></div></div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between mb-1"><span className="text-base font-medium text-gray-300">Innovation Factor</span><span className="text-sm font-medium text-white">{analysis.keyMetrics.innovationFactor}%</span></div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${analysis.keyMetrics.innovationFactor}%` }}></div></div>
                    </div>
                </div>
              </div>
              
              <button onClick={handleDownload} disabled={!analysis.reportMarkdown} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download Report
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}