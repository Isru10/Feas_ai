"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

// 1. IMPORT THE NECESSARY CLERK COMPONENTS
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

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

  return (
    // Your header structure remains the same
    <header className="relative w-full p-6 z-20"> 
      <div className="mx-auto flex justify-between items-center">
        {/* Logo remains the same */}
        <div className="text-3xl font-bold">
          <Link href="/">
            <span className="text-white">Feas</span>
            <span className="text-[#22C55E]">AI</span>
          </Link>
        </div>

        {/* Desktop Navigation remains the same */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="bg-[#166534] px-5 py-2 rounded-full">
            Home
          </Link>
          <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* --- 2. THIS IS THE UPDATED DESKTOP AUTH SECTION --- */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          {/* This part will ONLY show if the user is signed OUT */}
          <SignedOut>
            <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/sign-up" className="bg-[#16A34A] px-5 py-2 rounded-full text-white hover:bg-green-500 transition-colors">
              Register
            </Link>
          </SignedOut>

          {/* This part will ONLY show if the user is signed IN */}
          <SignedIn>
            {/* The UserButton component handles the profile picture, dropdown menu, and sign out functionality automatically. */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Hamburger Menu Button remains the same */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#030a03] bg-opacity-95 backdrop-blur-sm mt-2 border-t border-green-900">
          <div className="flex flex-col items-center space-y-6 py-8 text-lg">
            <Link href="/" className="text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/services" className="text-white" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/contact" className="text-white" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <hr className="w-1/2 border-gray-700" />
            
            {/* --- 3. THIS IS THE UPDATED MOBILE AUTH SECTION --- */}
            <SignedOut>
              <div className="flex flex-col items-center space-y-6">
                <Link href="/sign-in" className="text-gray-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/sign-up" className="bg-[#16A34A] px-8 py-3 rounded-full text-white" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            </SignedOut>
            <SignedIn>
               {/* Note: The UserButton also works on mobile, but for a more custom feel, you might show the user's name and a separate logout button. For now, this is the simplest and most effective solution. */}
               <UserButton afterSignOutUrl="/"/>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}