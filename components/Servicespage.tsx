import Link from "next/link";

// A small helper component to render SVG icons without cluttering the main code.
const Icon = ({ path }: { path: string }) => (
  <div className="flex-shrink-0 bg-green-950/70 border border-green-800 p-3 rounded-xl mb-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8 text-green-400"
    >
      <path d={path} />
    </svg>
  </div>
);

// An array to hold the data for our services. This makes the code cleaner.
const servicesData = [
  {
    iconPath: "M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375zM1.5 9.75v10.125c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.75M8.25 12h7.5",
    title: "AI Feasibility Reports",
    description: "Receive a comprehensive report analyzing your idea's market viability, potential risks, and probability of success, all generated in minutes."
  },
  {
    iconPath: "M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z",
    title: "SWOT Analysis",
    description: "Our AI dives deep to identify the core Strengths, Weaknesses, Opportunities, and Threats for your business with unparalleled clarity."
  },
  {
    iconPath: "M11.47 1.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 3.31 4.53 10.78a.75.75 0 01-1.06-1.06l7.5-7.5zM11.25 4.5v15a.75.75 0 001.5 0v-15a.75.75 0 00-1.5 0z",
    title: "Financial Projections",
    description: "Get data-driven forecasts for startup costs, potential revenue streams, burn rate, and your crucial break-even point."
  },
  {
    iconPath: "M12 21a9.004 9.004 0 008.716-6.747H3.284A9.005 9.005 0 0012 21zM12 3a9.005 9.005 0 00-8.716 6.747h17.432A9.005 9.005 0 0012 3z",
    title: "Market & Audience Research",
    description: "Instantly analyze your target demographics, identify key competitors, and understand the current market trends relevant to your idea."
  },
  {
    iconPath: "M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6",
    title: "Business Plan Structuring",
    description: "Our AI helps you structure a professional, investor-ready business plan by organizing your data and goals into a coherent narrative."
  },
  {
    iconPath: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l-2.846.813a4.5 4.5 0 01-3.09 3.09L9 18.75l2.846-.813a4.5 4.5 0 013.09-3.09l2.846-.813-2.846-.813a4.5 4.5 0 01-3.09-3.09L9 5.25l2.846.813a4.5 4.5 0 013.09 3.09L18.25 12z",
    title: "Idea 'Roasting'",
    description: "Submit your core concept and get brutally honest, constructive feedback highlighting potential flaws before you invest time and money."
  },
];

export default function ServicesPage() {
  return (
    <div className="py-20 lg:py-24">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-base font-semibold text-green-400 tracking-wider uppercase">Our Services</h2>
        <p className="mt-2 text-4xl lg:text-5xl font-bold tracking-tight text-white">
          AI-Powered Analysis for Every Stage
        </p>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400">
          From a spark of an idea to a full-fledged business plan, FeasAI provides the tools you need to make informed decisions and build with confidence.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div key={service.title} className="bg-green-950/40 p-8 rounded-2xl border border-green-800/50 transition-all duration-300 hover:border-green-600 hover:bg-green-950/60">
              <Icon path={service.iconPath} />
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="mt-2 text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-24 text-center px-4">
        <h3 className="text-3xl font-bold text-white">Ready to Validate Your Vision?</h3>
        <p className="mt-3 text-lg text-gray-400">Start your analysis today and turn your idea into an actionable plan.</p>
        <div className="mt-8">
          <Link
            href="/business_name"
            className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-green-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}