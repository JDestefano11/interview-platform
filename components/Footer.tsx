'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-[#0E1428]/90 backdrop-blur-md border-t border-[#4D4DFF]/20 py-12 mt-20">
      {/* Neural network background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-1.5 h-1.5 bg-[#00F6C5] rounded-full shadow-[0_0_12px_rgba(0,246,197,0.6)] animate-pulse"></div>
        <div className="absolute top-[70%] left-[15%] w-1 h-1 bg-[#4D4DFF] rounded-full shadow-[0_0_10px_rgba(77,77,255,0.6)] animate-pulse-delay"></div>
        <div className="absolute bottom-[40%] right-[25%] w-1 h-1 bg-[#9C42F5] rounded-full shadow-[0_0_10px_rgba(156,66,245,0.6)] animate-pulse-slow"></div>
        
        {/* Data flow lines */}
        <div className="absolute top-[30%] -left-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#00F6C5]/20 to-transparent animate-data-flow-right" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-[60%] -right-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#4D4DFF]/20 to-transparent animate-data-flow-left" style={{animationDuration: '18s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <h3 className="text-[#E2F0FF] font-semibold text-xl">IntelliView</h3>
            </div>
            <p className="text-[#8BA3C7] text-sm leading-relaxed">
              Elevate your interview skills with AI-powered practice and feedback.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1A2138]/80 flex items-center justify-center border border-[#4D4DFF]/30 hover:border-[#01CDFE]/50 transition-colors">
                <Github className="w-4 h-4 text-[#8BA3C7]" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1A2138]/80 flex items-center justify-center border border-[#4D4DFF]/30 hover:border-[#01CDFE]/50 transition-colors">
                <Linkedin className="w-4 h-4 text-[#8BA3C7]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1A2138]/80 flex items-center justify-center border border-[#4D4DFF]/30 hover:border-[#01CDFE]/50 transition-colors">
                <Twitter className="w-4 h-4 text-[#8BA3C7]" />
              </a>
              <a href="mailto:contact@example.com" className="w-8 h-8 rounded-full bg-[#1A2138]/80 flex items-center justify-center border border-[#4D4DFF]/30 hover:border-[#01CDFE]/50 transition-colors">
                <Mail className="w-4 h-4 text-[#8BA3C7]" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h4 className="text-[#E2F0FF] font-medium text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Interviews
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h4 className="text-[#E2F0FF] font-medium text-base mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Interview Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#8BA3C7] hover:text-[#01CDFE] text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-[#E2F0FF] font-medium text-base mb-4">Contact</h4>
            <p className="text-[#8BA3C7] text-sm mb-4">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#4D4DFF]/20 text-[#01CDFE] text-sm font-medium border border-[#4D4DFF]/30 hover:bg-[#4D4DFF]/30 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#4D4DFF]/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[#8BA3C7] text-xs mb-4 sm:mb-0">
            © {currentYear} InterviewPro. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-[#8BA3C7] hover:text-[#01CDFE] text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#8BA3C7] hover:text-[#01CDFE] text-xs transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-[#8BA3C7] hover:text-[#01CDFE] text-xs transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
