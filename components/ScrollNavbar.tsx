'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { logout } from '@/utilis/auth';

export default function ScrollNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // First useEffect just to mark component as mounted
  // This prevents any hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll effects - only run after mounting
  useEffect(() => {
    if (!isMounted) return;
    
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
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);
  
  // Handle authentication status - in a separate useEffect to avoid hydration issues
  useEffect(() => {
    // Only run after component is mounted and we're in the browser
    if (!isMounted || typeof window === 'undefined') return;
    
    const checkAuth = () => {
      try {
        const hasAuthCookie = document.cookie.includes('auth-token');
        setIsAuthenticated(hasAuthCookie);
      } catch (error) {
        console.warn('Error checking authentication status:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Also check auth status when storage changes (in case of logout in another tab)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isMounted]);

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
            {/* Only render the button client-side after hydration */}
            {typeof window !== 'undefined' && isAuthenticated && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  
                  // Disable the button to prevent multiple clicks
                  const button = e.currentTarget;
                  button.disabled = true;
                  
                  // First clear the cookie directly - this is the most reliable method
                  document.cookie = "auth-token=; expires=Thu, 1 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "auth-token=; path=/; max-age=0";
                  
                  // Use a longer delay for more reliable logout
                  setTimeout(() => {
                    try {
                      // Call the logout function which will handle Firebase signout
                      logout();
                    } catch (error) {
                      console.warn('Error in logout function:', error);
                      // If the logout function fails, redirect manually
                      window.location.replace("/signin");
                    }
                  }, 300);
                }}
                className="text-sm font-medium text-[#01CDFE] hover:text-[#01CDFE]/80 transition-colors cursor-pointer"
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
