"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  // Your existing useEffect to save the user remains completely UNTOUCHED.
  useEffect(() => {
    const registerUser = async () => {
      if (user && isLoaded) {
        await fetch('/api/save-user', {
          method: 'POST',
          body: JSON.stringify({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName,
          }),
        });
      }
    };

    registerUser();
  }, [user, isLoaded]);

  // --- THIS IS THE NEW SCROLLING FUNCTION ---
  // It handles the smooth scroll logic when a section link is clicked.
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault(); // Prevents the default "jump" behavior of the link.
    const element = document.getElementById(id); // Finds the section on the page by its ID.
    if (element) {
      // Scrolls the view to that element smoothly.
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false); // Closes the mobile menu after a link is clicked.
  };

  return (
    // Your main header structure is untouched.
    <header className="relative w-full p-6 z-20"> 
      <div className="mx-auto flex justify-between items-center">
        {/* Logo remains untouched */}
        <div className="text-3xl font-bold">
          <Link href="/">
            <span className="text-white">Feas</span>
            <span className="text-[#22C55E]">AI</span>
          </Link>
        </div>

        {/* --- DESKTOP NAVIGATION UPDATED FOR SCROLLING --- */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="bg-[#166534] px-5 py-2 rounded-full">
            Home
          </Link>
          {/* The href is now an anchor link, and onClick triggers the scroll */}
          <Link href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-gray-300 hover:text-white transition-colors">
            Services
          </Link>
          {/* The href is now an anchor link, and onClick triggers the scroll */}
          <Link href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Your desktop auth section remains completely untouched */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <SignedOut>
            <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/sign-up" className="bg-[#16A34A] px-5 py-2 rounded-full text-white hover:bg-green-500 transition-colors">
              Register
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Your hamburger menu button remains completely untouched */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU UPDATED FOR SCROLLING --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#030a03] bg-opacity-95 backdrop-blur-sm mt-2 border-t border-green-900">
          <div className="flex flex-col items-center space-y-6 py-8 text-lg">
            <Link href="/" className="text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {/* The href is now an anchor link, and onClick triggers the scroll */}
            <Link href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-white">Services</Link>
            {/* The href is now an anchor link, and onClick triggers the scroll */}
            <Link href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-white">Contact</Link>
            <hr className="w-1/2 border-gray-700" />
            
            {/* Your mobile auth section remains completely untouched */}
            <SignedOut>
              <div className="flex flex-col items-center space-y-6">
                <Link href="/sign-in" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/sign-up" className="bg-[#16A34A] px-8 py-3 rounded-full text-white" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            </SignedOut>
            <SignedIn>
               <UserButton afterSignOutUrl="/"/>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}