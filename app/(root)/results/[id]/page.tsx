"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';

// Updated interface to include the brutal verdict from the API
interface AnalysisData {
  overallScore: number;
  keyMetrics: {
    marketPotential: number;
    financialViability: number;
    innovationFactor: number;
  };
  reportMarkdown: string;
  brutalVerdict: string; 
}

// =================================================================
// UI HELPER COMPONENTS
// =================================================================

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
    <div className="relative flex justify-center items-center">
      <div className="absolute w-24 h-24 rounded-full animate-spin border-4 border-dashed border-green-500"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-600 animate-pulse"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l-2.846.813a4.5 4.5 0 01-3.09 3.09L9 18.75l2.846-.813a4.5 4.5 0 013.09-3.09l2.846-.813-2.846-.813a4.5 4.5 0 01-3.09-3.09L9 5.25l2.846.813a4.5 4.5 0 013.09 3.09L18.25 12z" /></svg>
    </div>
    <h2 className="text-3xl font-bold text-white mt-8">FeasAI is Roasting Your Idea...</h2>
    <p className="mt-4 text-lg text-gray-400">This can take up to a minute. Great analysis requires great focus.</p>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="w-full max-w-2xl mx-auto bg-red-950/30 border border-red-800/50 rounded-2xl p-8 shadow-2xl shadow-red-950/20 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-500 mx-auto"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
    <h2 className="text-3xl font-bold text-red-400 mt-6">Analysis Failed</h2>
    <p className="mt-4 text-lg text-red-300">{error}</p>
    <Link href="/" className="mt-8 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-500 transition-colors">Start Over</Link>
  </div>
);

const KeyMetricsChart = ({ data }: { data: AnalysisData['keyMetrics'] }) => {
  const chartData = [
    { name: 'Market', score: data.marketPotential },
    { name: 'Finance', score: data.financialViability },
    { name: 'Innovation', score: data.innovationFactor },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="name" tick={{ fill: '#a0aec0', fontSize: 14 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#a0aec0', fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #2d3748', borderRadius: '0.5rem', color: '#fff' }} labelStyle={{ color: '#a0aec0' }} />
        <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// A Modal component to display the brutal roast
const RoastModal = ({ isOpen, onClose, verdict }: { isOpen: boolean; onClose: () => void; verdict: string | null; }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-gray-900 border border-red-700 rounded-2xl p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-2xl font-bold text-red-400">The Brutal Truth</h3>
        <div className="mt-6 min-h-[100px] flex items-center justify-center">
          {verdict && <p className="text-white text-2xl font-semibold italic">{verdict}</p>}
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const params = useParams();
  const businessPlanId = params.id as string;
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate analysis. Please try again later.');
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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!analysis) return null;

  return (
    <>
      <RoastModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        verdict={analysis.brutalVerdict}
      />
      <div className="w-full max-w-7xl mx-auto py-12">
        <header className="text-center mb-12 px-4">
          <h1 className="text-5xl font-bold text-white">Feasibility Analysis Report</h1>
          <p className="mt-3 text-xl text-gray-400">Your comprehensive AI-powered breakdown is ready.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 bg-gray-950/30 border border-green-800/30 rounded-2xl p-8 shadow-lg">
            <ReactMarkdown
              components={{
                h1: ({...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-green-400 border-b border-green-800/50 pb-2" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-bold mt-5 mb-2 text-green-300" {...props} />,
                p: ({...props}) => <p className="text-lg text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-300" {...props} />,
                li: ({...props}) => <li className="pl-2" {...props} />,
                strong: ({...props}) => <strong className="font-semibold text-green-400" {...props} />,
              }}
            >
              {analysis.reportMarkdown}
            </ReactMarkdown>
          </main>
          
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-900/50 border border-gray-700 rounded-2xl p-6 space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">Overall Score</h3>
                <p className="text-6xl font-bold text-green-400 mt-2">{analysis.overallScore.toFixed(1)}<span className="text-3xl text-gray-400">/5</span></p>
                <p className="text-gray-400 mt-1">
                  {analysis.overallScore > 4 ? 'Excellent Potential' : analysis.overallScore > 3 ? 'Promising with Room to Improve' : analysis.overallScore > 2 ? 'Requires Significant Work' : 'High-Risk Venture'}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Key Metrics Breakdown</h3>
                <KeyMetricsChart data={analysis.keyMetrics} />
              </div>
              
              <button onClick={handleDownload} disabled={!analysis.reportMarkdown} className="w-full group flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 rounded-full text-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                Download Report
              </button>

              {/* --- NEW: The Brutal Roast Button and its container --- */}
              <div className="border-t border-gray-700 pt-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full group flex items-center justify-center gap-3 bg-red-800/80 text-red-200 font-bold py-3 rounded-full text-lg hover:bg-red-700/90 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110">
                    <path d="M11.983 1.904a3.003 3.003 0 00-3.966 0L3.33 6.825a3.003 3.003 0 00-1.212 2.155V13.25a3 3 0 003 3h10a3 3 0 003-3V8.98a3.003 3.003 0 00-1.212-2.155L11.983 1.904zM10 4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 4.5zM10.875 12a.875.875 0 10-1.75 0 .875.875 0 001.75 0z" />
                  </svg>
                  Get the Brutal Truth
                </button>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </>
  );
}