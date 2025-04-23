'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Star, CheckCircle2, Briefcase } from 'lucide-react';

// Mock data for user's interviews
const mockUserInterviews = [
  { 
    id: 1, 
    company: 'Google',
    logo: '/mock/google.png', 
    position: 'Senior Frontend Developer',
    date: '2025-04-15',
    score: 92,
    status: 'completed'
  },
  { 
    id: 2, 
    company: 'Microsoft',
    logo: '/mock/microsoft.png', 
    position: 'Full Stack Engineer',
    date: '2025-04-10',
    score: 85,
    status: 'completed'
  },
  { 
    id: 3, 
    company: 'Amazon',
    logo: '/mock/amazon.png', 
    position: 'React Developer',
    date: '2025-04-05',
    score: 78,
    status: 'completed'
  },
  { 
    id: 4, 
    company: 'Meta',
    logo: '/mock/meta.png', 
    position: 'UI Engineer',
    date: '2025-03-28',
    score: 88,
    status: 'completed'
  },
];

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Interview Card Component
const InterviewCard = ({ interview }: { interview: any }) => (
  <div className="group relative h-full">
    <Link href={`/interviews/${interview.id}`} className="block no-underline h-full">
      {/* Card background with enhanced glassmorphism */}
      <div className="bg-[#1A2138]/60 backdrop-blur-sm border border-[#4D4DFF]/20 rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col
                  group-hover:border-[#01CDFE]/30 group-hover:shadow-[0_0_20px_rgba(1,205,254,0.15)] group-hover:-translate-y-1 cursor-pointer
                  xl:min-h-[320px] 2xl:min-h-[340px]">
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#01CDFE]/30 to-transparent"></div>
        
        {/* Technical label in top right with enhanced styling */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-[#01CDFE]/10 backdrop-blur-md text-[#01CDFE] border border-[#01CDFE]/30 shadow-[0_0_10px_rgba(1,205,254,0.2)]">
          Technical
        </div>
        
        {/* Card header with company info - minimal left padding */}
        <div className="p-6 xl:p-7 pl-2 xl:pl-3">
          <div className="flex items-center gap-2 xl:gap-3">
            {/* Company logo with consistent sizing */}
            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-lg bg-gradient-to-br from-[#1A2138]/80 to-[#0E1428]/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-[#4D4DFF]/20 shadow-[0_0_15px_rgba(1,205,254,0.15)]">
              <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-br from-[#4D4DFF] to-[#01CDFE] rounded-md flex items-center justify-center text-white font-bold text-base">
                {interview.company.charAt(0)}
              </div>
            </div>
            
            {/* Company and position with perfect alignment */}
            <div className="flex-1">
              <h4 className="text-[#E2F0FF] font-semibold text-base xl:text-lg leading-tight tracking-tight">{interview.company}</h4>
              <p className="text-[#8BA3C7] text-xs xl:text-sm mt-0.5 xl:mt-1 truncate max-w-full">{interview.position}</p>
            </div>
          </div>
          
          {/* Small description */}
          <div className="mt-3 xl:mt-4 text-[#8BA3C7] text-xs leading-relaxed">
            <p className="line-clamp-2">Practice your {interview.position.toLowerCase()} skills with our AI-powered technical interview simulation.</p>
          </div>
        </div>
        
        {/* Clean separator with subtle gradient */}
        <div className="px-3 xl:px-4">
          <div className="relative h-px w-full bg-[#4D4DFF]/10">
            <div className="absolute inset-0 h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#01CDFE]/20 to-transparent"></div>
          </div>
        </div>
        
        {/* Ultra-compact card body with date and score side by side - balanced spacing */}
        <div className="p-4 xl:p-5 pt-4 xl:pt-5 pb-2 xl:pb-3 px-3 xl:px-4">
          <div className="flex items-center space-x-2">
            {/* Minimalist date display */}
            <div className="flex items-center bg-[#0E1428]/50 backdrop-blur-sm rounded-lg py-1.5 px-1.5 border border-[#4D4DFF]/10 flex-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4D4DFF]/10 to-[#01CDFE]/10 flex items-center justify-center mr-1 border border-[#4D4DFF]/20">
                <Clock className="w-2.5 h-2.5 text-[#01CDFE]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline">
                  <span className="text-[#8BA3C7] text-[10px] uppercase tracking-wider font-medium mr-0.5">Date</span>
                  <span className="text-[#E2F0FF] font-medium text-[11px] xl:text-xs truncate">{formatDate(interview.date)}</span>
                </div>
              </div>
            </div>
            
            {/* Minimalist score display */}
            <div className="flex items-center bg-[#0E1428]/50 backdrop-blur-sm rounded-lg py-1.5 px-1.5 border border-[#4D4DFF]/10 flex-1">
              <div className="relative mr-1">
                {/* Circular progress background */}
                <div className="w-5 h-5 rounded-full bg-[#0E1428] border border-[#4D4DFF]/20 flex items-center justify-center">
                  {/* Circular progress indicator */}
                  <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 20 20">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="#FFC700"
                      strokeWidth="1.5"
                      strokeDasharray={`${(interview.score / 100) * 50.24} 50.24`}
                      strokeDashoffset="12.56"
                      strokeLinecap="round"
                      transform="rotate(-90 10 10)"
                      className="opacity-80"
                    />
                  </svg>
                  <Star className="w-2.5 h-2.5 text-[#FFC700] z-10" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline">
                  <span className="text-[#8BA3C7] text-[10px] uppercase tracking-wider font-medium mr-0.5">Score</span>
                  <span className="text-[#E2F0FF] font-medium text-[11px] xl:text-xs">
                    {interview.score}<span className="text-[#8BA3C7]">%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacer to push button down */}
        <div className="flex-grow min-h-[20px] xl:min-h-[30px]"></div>
        
        {/* Card footer with action button moved down */}
        <div className="px-6 xl:px-7 pb-6 xl:pb-7 mt-auto">
          <button className="group/btn relative w-full bg-gradient-to-r from-[#4D4DFF]/90 to-[#01CDFE]/90 text-white px-5 py-2.5 xl:py-3 rounded-lg text-sm xl:text-base font-medium shadow-[0_0_15px_rgba(1,205,254,0.2)] hover:shadow-[0_0_25px_rgba(1,205,254,0.4)] transition-all duration-300 overflow-hidden">
            {/* Button glow effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#4D4DFF] to-[#01CDFE] opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-500"></span>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Interview
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </Link>
  </div>
);

export default function YourInterviews() {
  return (
    <section className="relative py-16">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Neural network nodes with improved glow */}
        <div className="absolute top-[10%] right-[5%] w-2 h-2 bg-[#01CDFE] rounded-full shadow-[0_0_15px_rgba(1,205,254,0.6)] animate-pulse"></div>
        <div className="absolute top-[70%] left-[8%] w-1.5 h-1.5 bg-[#9C42F5] rounded-full shadow-[0_0_12px_rgba(156,66,245,0.6)] animate-pulse-delay"></div>
        <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 bg-[#00F6C5] rounded-full shadow-[0_0_12px_rgba(0,246,197,0.6)] animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[20%] w-1 h-1 bg-[#FFC700] rounded-full shadow-[0_0_10px_rgba(255,199,0,0.6)] animate-pulse-slow"></div>
        <div className="absolute bottom-[60%] right-[25%] w-1 h-1 bg-[#FF3864] rounded-full shadow-[0_0_10px_rgba(255,56,100,0.6)] animate-pulse"></div>
        
        {/* Data flow lines with enhanced animations */}
        <div className="absolute top-[30%] -left-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#01CDFE]/20 to-transparent animate-data-flow-right" style={{animationDuration: '12s'}}></div>
        <div className="absolute bottom-[40%] -right-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#4D4DFF]/20 to-transparent animate-data-flow-left" style={{animationDuration: '15s'}}></div>
        <div className="absolute top-[60%] -left-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#9C42F5]/20 to-transparent animate-data-flow-right" style={{animationDuration: '18s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:50px_50px] opacity-[0.03]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced section header with aligned subtitle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#E2F0FF] tracking-tight mb-1">
                Your Recent Interviews
              </h2>
              <p className="text-[#8BA3C7] text-sm">Continue where you left off or review your past performance</p>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-2 rounded-full bg-[#1A2138]/60 backdrop-blur-sm border border-[#4D4DFF]/20 text-[#8BA3C7] text-sm shadow-[0_0_15px_rgba(1,205,254,0.1)]">
            <CheckCircle2 className="w-4 h-4 mr-2 text-[#01CDFE]" />
            <span>Based on your profile</span>
          </div>
        </div>
        
        {/* Card grid with slightly wider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10 2xl:gap-12">
          {mockUserInterviews.map((interview) => (
            <div key={interview.id} className="xl:scale-105 2xl:scale-110 transform transition-transform duration-300 origin-center">
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
