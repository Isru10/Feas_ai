

// This is a new, simplified, and fully working Contact Page component.
export default function ContactPage() {
  return (
        <section id="contact" className="w-full">

    <div className="py-20 lg:py-24">
      {/* Page Header */}
      <div className="text-center px-4">
        <h2 className="text-base font-semibold text-green-400 tracking-wider uppercase">Contact</h2>
        <p className="mt-2 text-4xl lg:text-5xl font-bold tracking-tight text-white">Wed Love to Hear From You</p>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400">
          Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      {/* Main Content Area: Two-Column Layout */}
      <div className="max-w-7xl mx-auto mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Contact Information */}
          <div className="text-left">
            <h3 className="text-3xl font-bold text-white">Contact Information</h3>
            <p className="mt-3 text-gray-400">
              Find us through any of these channels. Were excited to connect with you and help bring your business ideas to life.
            </p>
            <div className="mt-8 space-y-8">

              {/* Email Contact Method */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Email Us</h4>
                  <a href="mailto:support@feassai.com" className="text-gray-400 hover:text-green-300 transition-colors">
                    support@feassai.com
                  </a>
                </div>
              </div>

              {/* Phone Contact Method */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.279-.087.431l4.287 7.423c.077.152.23.23.383.23h.001c.152 0 .306-.077.383-.23l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C6.54 22.5 2.25 18.21 2.25 11.75S6.54 1.5 12.75 1.5H15a3 3 0 013 3v.75" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Call Us</h4>
                  <a href="tel:+15551234567" className="text-gray-400 hover:text-green-300 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              {/* Address Contact Method */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.169-4.418 16.975 16.975 0 004.6-8.025A9.75 9.75 0 0012 3c-4.42 0-8.22 3.23-9.513 7.589A16.975 16.975 0 006.37 17.933a16.975 16.975 0 005.169 4.418zM12 1.5c5.385 0 9.75 4.365 9.75 9.75 0 4.346-2.822 8.16-6.703 9.48a18.534 18.534 0 01-6.094 0C5.072 19.41 2.25 15.596 2.25 11.25 2.25 5.865 6.615 1.5 12 1.5zM12 8.25a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Our Office</h4>
                  <p className="text-gray-400">123 Innovation Drive, Tech City, 94105</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-green-950/40 p-8 rounded-2xl border border-green-800/50">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input type="text" id="name" name="name" className="w-full bg-[#14532d]/50 p-3 rounded-lg border border-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="w-full bg-[#14532d]/50 p-3 rounded-lg border border-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea id="message" name="message" rows={5} className="w-full bg-[#14532d]/50 p-3 rounded-lg border border-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-500 transition-colors w-full">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
    </section>
  );
}