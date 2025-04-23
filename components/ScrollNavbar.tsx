'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { logout } from '@/utilis/auth';

export default function ScrollNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Check authentication status
    const checkAuth = () => {
      const hasAuthCookie = document.cookie.includes('auth-token');
      setIsAuthenticated(hasAuthCookie);
    };
    
    checkAuth();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0E1428] shadow-lg border-b-2 border-[#01CDFE]' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/*Logo*/}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center"> 
              <Briefcase className="h-6 w-6 text-[#01CDFE] mr-2 drop-shadow-[0_0_12px_rgba(1,205,254,0.7)]" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4D4DFF] via-[#01CDFE] to-[#9C42F5]">PrepMaster</span>
            </Link>
          </div>
          {/*Auth Buttons*/}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button 
                onClick={logout}
                className="text-sm font-medium text-[#01CDFE] hover:text-[#01CDFE]/80 transition-colors cursor-pointer bg-[#1A2138]/30 shadow-[0_0_20px_rgba(77,77,255,0.15)] hover:shadow-[0_0_25px_rgba(77,77,255,0.25)] transition-all duration-300 border border-[#4D4DFF]/30 hover:border-[#4D4DFF]/50 px-5 py-2 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
