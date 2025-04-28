'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import robotAi from "../../public/XYVO (1).svg";
import PerformanceTab from '@/components/PerformanceTab';

// Mock data for interviews
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

const mockPopularInterviews = [
  { 
    id: 101, 
    company: 'Apple',
    logo: '/mock/apple.png', 
    position: 'iOS Developer',
    difficulty: 'Hard',
    takenCount: 1458,
    avgScore: 76
  },
  { 
    id: 102, 
    company: 'Netflix',
    logo: '/mock/netflix.png', 
    position: 'Frontend Engineer',
    difficulty: 'Medium',
    takenCount: 1245,
    avgScore: 82
  },
  { 
    id: 103, 
    company: 'Tesla',
    logo: '/mock/tesla.png', 
    position: 'UI/UX Designer',
    difficulty: 'Medium',
    takenCount: 987,
    avgScore: 79
  },
  { 
    id: 104, 
    company: 'Spotify',
    logo: '/mock/spotify.png', 
    position: 'React Developer',
    difficulty: 'Hard',
    takenCount: 876,
    avgScore: 74
  },
];

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};


const HomePage = () => {
  return (
    <main className="min-h-screen relative">
      
      {/* Hero Section - completely integrated with no visual separation */}
      <section className="pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-visible border-none shadow-none outline-none">
        {/* Ensure no lines or borders appear */}
        <div className="absolute inset-0 -z-10 bg-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-16 items-center bg-transparent">
            {/* Mobile-only image for better mobile layout - matching desktop style */}
            <div className="block lg:hidden relative w-full max-w-sm mx-0 ml-0 mb-4">
              {/* Enhanced multi-layered background that blends with the page */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4D4DFF]/25 via-[#9C42F5]/20 to-[#01CDFE]/25 rounded-3xl blur-3xl opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#01CDFE]/15 via-transparent to-[#9C42F5]/20 rounded-3xl blur-2xl opacity-80"></div>
              
              {/* Advanced tech backdrop with neural network elements */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {/* Data flow visualization */}
                <div className="absolute top-[20%] -left-20 w-80 h-[1px] bg-gradient-to-r from-transparent via-[#01CDFE]/50 to-transparent animate-data-flow-right" style={{animationDuration: '12s'}}></div>
                <div className="absolute top-[40%] -right-20 w-80 h-[1px] bg-gradient-to-r from-transparent via-[#4D4DFF]/50 to-transparent animate-data-flow-left" style={{animationDuration: '10s'}}></div>
                <div className="absolute top-[60%] -left-20 w-80 h-[1px] bg-gradient-to-r from-transparent via-[#9C42F5]/50 to-transparent animate-data-flow-right" style={{animationDuration: '14s'}}></div>
                <div className="absolute top-[80%] -right-20 w-80 h-[1px] bg-gradient-to-r from-transparent via-[#00F6C5]/50 to-transparent animate-data-flow-left" style={{animationDuration: '16s'}}></div>
                
                {/* Neural network nodes */}
                <div className="absolute top-[15%] left-[25%] w-2.5 h-2.5 bg-[#01CDFE] rounded-full shadow-[0_0_20px_rgba(1,205,254,0.9)] animate-pulse"></div>
                <div className="absolute top-[35%] left-[75%] w-2 h-2 bg-[#4D4DFF] rounded-full shadow-[0_0_18px_rgba(77,77,255,0.9)] animate-pulse-delay"></div>
                <div className="absolute top-[65%] left-[30%] w-2.5 h-2.5 bg-[#9C42F5] rounded-full shadow-[0_0_20px_rgba(156,66,245,0.9)] animate-pulse-slow"></div>
                <div className="absolute top-[85%] left-[70%] w-2 h-2 bg-[#00F6C5] rounded-full shadow-[0_0_18px_rgba(0,246,197,0.9)] animate-pulse"></div>
                
                {/* Connection lines between nodes */}
                <svg className="absolute inset-0 w-full h-full" style={{filter: 'blur(1px)'}}>
                  <line x1="25%" y1="15%" x2="75%" y2="35%" stroke="#01CDFE" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-slow" />
                  <line x1="75%" y1="35%" x2="30%" y2="65%" stroke="#4D4DFF" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse" />
                  <line x1="30%" y1="65%" x2="70%" y2="85%" stroke="#9C42F5" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-delay" />
                  <line x1="25%" y1="15%" x2="30%" y2="65%" stroke="#00F6C5" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-slow" />
                </svg>
              </div>
              
              {/* Platform for robot to sit on - enhanced to look more like a seat */}
              <div className="absolute bottom-[20%] left-[5%] right-[5%] h-[8%] bg-gradient-to-r from-[#4D4DFF]/40 via-[#01CDFE]/50 to-[#9C42F5]/40 rounded-xl blur-sm"></div>
              <div className="absolute bottom-[20%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[#01CDFE]/80 via-[#4D4DFF]/80 to-[#01CDFE]/80 rounded-full shadow-[0_0_15px_rgba(1,205,254,0.9)]"></div>
              
              {/* Additional platform details to make it look more like a seat */}
              <div className="absolute bottom-[20%] left-[20%] right-[20%] h-[15px] bg-gradient-to-b from-[#01CDFE]/30 to-transparent rounded-t-xl blur-sm"></div>
              <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[2px] bg-[#00F6C5]/70 rounded-full shadow-[0_0_10px_rgba(0,246,197,0.8)]"></div>
              
              {/* 3D geometric elements */}
              <div className="absolute top-[20%] left-[15%] w-10 h-10 animate-float" style={{animationDuration: '8s', transform: 'perspective(500px) rotateX(45deg) rotateY(45deg)'}}>
                <div className="absolute inset-0 border-2 border-[#01CDFE]/40 transform rotate-[15deg] shadow-[0_0_15px_rgba(1,205,254,0.3)]"></div>
                <div className="absolute inset-2 border border-[#01CDFE]/20 transform rotate-[5deg]"></div>
              </div>
              
              <div className="absolute bottom-[25%] right-[15%] w-8 h-8 animate-float-delay" style={{animationDuration: '10s', transform: 'perspective(500px) rotateX(-35deg) rotateY(-45deg)'}}>
                <div className="absolute inset-0 border-2 border-[#9C42F5]/40 transform shadow-[0_0_15px_rgba(156,66,245,0.3)]"></div>
                <div className="absolute inset-0 border border-[#9C42F5]/20 transform scale-75"></div>
              </div>
              
              <div className="relative z-10 -ml-16 sm:-ml-24 overflow-visible -mt-8 sm:-mt-12 mb-[-15%]">
                <Image 
                  src={robotAi}
                  alt="AI Interview Assistant" 
                  width={900} 
                  height={800}
                  className="relative z-10 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] object-contain drop-shadow-[0_0_30px_rgba(1,205,254,0.35)] transform scale-150 sm:scale-175"
                />
              </div>
            </div>
            {/* Left Column - Call to Action - more integrated with the page */}
            <div className="relative z-10 p-0 sm:p-2 md:p-4 bg-transparent">
              {/* Subtle background effects that blend perfectly with global background */}
              <div className="absolute -left-40 -top-40 w-[200%] h-[200%] -z-10">
                {/* Very subtle gradient glow that doesn't create visual separation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4D4DFF]/3 via-[#01CDFE]/2 to-[#9C42F5]/3 blur-3xl opacity-80"></div>
                
                {/* Animated data flow lines with better transparency */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-[15%] -right-60 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#01CDFE]/20 to-transparent animate-data-flow-right"></div>
                  <div className="absolute top-[35%] -left-60 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#4D4DFF]/20 to-transparent animate-data-flow-left"></div>
                  <div className="absolute top-[55%] -right-60 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#9C42F5]/20 to-transparent animate-data-flow-right-delay"></div>
                  <div className="absolute top-[75%] -left-60 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#00F6C5]/20 to-transparent animate-data-flow-left-delay"></div>
                </div>
                
                {/* More subtle floating accent dots matching global neural nodes */}
                <div className="absolute top-[10%] left-[10%] w-2 h-2 rounded-full bg-[#FF3864] shadow-[0_0_15px_rgba(255,56,100,0.4)] animate-float opacity-30"></div>
                <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#01CDFE] shadow-[0_0_12px_rgba(1,205,254,0.4)] animate-float-delay opacity-30"></div>
                <div className="absolute bottom-[30%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#9C42F5] shadow-[0_0_12px_rgba(156,66,245,0.4)] animate-pulse opacity-30"></div>
                <div className="absolute bottom-[15%] right-[15%] w-2 h-2 rounded-full bg-[#00F6C5] shadow-[0_0_15px_rgba(0,246,197,0.4)] animate-pulse-delay opacity-30"></div>
              </div>
              
              {/* Main content with enhanced styling */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1A2138]/60 backdrop-blur-sm border border-[#4D4DFF]/30 text-sm text-[#01CDFE] shadow-[0_0_20px_rgba(1,205,254,0.3)]">
                  <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
                  <span>AI-Powered Interview Preparation</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="block text-[#E2F0FF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Master Your</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#4D4DFF] via-[#01CDFE] to-[#9C42F5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Interview Skills</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-[#8BA3C7] max-w-xl leading-relaxed">
                  Prepare for your next interview with our AI-powered platform. Practice with realistic scenarios and get personalized feedback to land your dream job.
                </p>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-5">
                <Link href="/signup" className="no-underline w-full sm:w-auto">
                  <button className="group relative flex items-center justify-center gap-2 w-full px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#4D4DFF] to-[#01CDFE] text-white font-medium transition-all duration-300 shadow-[0_0_25px_rgba(77,77,255,0.4)] hover:shadow-[0_0_35px_rgba(1,205,254,0.6)] overflow-hidden cursor-pointer min-w-[160px]">
                    {/* Button glow effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#4D4DFF] to-[#01CDFE] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Right Column - AI Assistant Image with advanced tech backdrop */}
            <div className="hidden lg:block relative">
              {/* Enhanced multi-layered background that blends with the page */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4D4DFF]/25 via-[#9C42F5]/20 to-[#01CDFE]/25 rounded-3xl blur-3xl opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#01CDFE]/15 via-transparent to-[#9C42F5]/20 rounded-3xl blur-2xl opacity-80"></div>
              
              {/* Advanced tech backdrop with modern grid patterns */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">

                
                {/* Data flow visualization */}
                <div className="absolute top-[20%] -left-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#01CDFE]/50 to-transparent animate-data-flow-right" style={{animationDuration: '12s'}}></div>
                <div className="absolute top-[40%] -right-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#4D4DFF]/50 to-transparent animate-data-flow-left" style={{animationDuration: '10s'}}></div>
                <div className="absolute top-[60%] -left-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#9C42F5]/50 to-transparent animate-data-flow-right" style={{animationDuration: '14s'}}></div>
                <div className="absolute top-[80%] -right-40 w-120 h-[1px] bg-gradient-to-r from-transparent via-[#00F6C5]/50 to-transparent animate-data-flow-left" style={{animationDuration: '16s'}}></div>
                
                {/* Neural network nodes */}
                <div className="absolute top-[15%] left-[25%] w-3 h-3 bg-[#01CDFE] rounded-full shadow-[0_0_20px_rgba(1,205,254,0.9)] animate-pulse"></div>
                <div className="absolute top-[35%] left-[75%] w-2.5 h-2.5 bg-[#4D4DFF] rounded-full shadow-[0_0_18px_rgba(77,77,255,0.9)] animate-pulse-delay"></div>
                <div className="absolute top-[65%] left-[30%] w-3 h-3 bg-[#9C42F5] rounded-full shadow-[0_0_20px_rgba(156,66,245,0.9)] animate-pulse-slow"></div>
                <div className="absolute top-[85%] left-[70%] w-2.5 h-2.5 bg-[#00F6C5] rounded-full shadow-[0_0_18px_rgba(0,246,197,0.9)] animate-pulse"></div>
                
                {/* Connection lines between nodes */}
                <svg className="absolute inset-0 w-full h-full" style={{filter: 'blur(1px)'}}>
                  <line x1="25%" y1="15%" x2="75%" y2="35%" stroke="#01CDFE" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-slow" />
                  <line x1="75%" y1="35%" x2="30%" y2="65%" stroke="#4D4DFF" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse" />
                  <line x1="30%" y1="65%" x2="70%" y2="85%" stroke="#9C42F5" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-delay" />
                  <line x1="25%" y1="15%" x2="30%" y2="65%" stroke="#00F6C5" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse-slow" />
                </svg>
              </div>
              
              {/* Floating geometric elements with 3D effect */}
              <div className="absolute inset-0">
                {/* 3D cube wireframe */}
                <div className="absolute top-[10%] left-[10%] w-16 h-16 animate-float" style={{animationDuration: '8s', transform: 'perspective(500px) rotateX(45deg) rotateY(45deg)'}}>
                  <div className="absolute inset-0 border-2 border-[#01CDFE]/40 transform rotate-[15deg] shadow-[0_0_15px_rgba(1,205,254,0.3)]"></div>
                  <div className="absolute inset-2 border border-[#01CDFE]/20 transform rotate-[5deg]"></div>
                </div>
                
                {/* Floating holographic pyramid */}
                <div className="absolute bottom-[15%] right-[10%] w-14 h-14 animate-float-delay" style={{animationDuration: '10s', transform: 'perspective(500px) rotateX(-35deg) rotateY(-45deg)'}}>
                  <div className="absolute inset-0 border-2 border-[#9C42F5]/40 transform shadow-[0_0_15px_rgba(156,66,245,0.3)]"></div>
                  <div className="absolute inset-0 border border-[#9C42F5]/20 transform scale-75"></div>
                </div>
                
                {/* Circuit board elements */}
                <div className="absolute top-[40%] right-[15%] w-20 h-12 animate-float-delay-2" style={{animationDuration: '9s'}}>
                  <div className="absolute inset-0 border-2 border-[#4D4DFF]/40 rounded-md transform -rotate-[10deg] shadow-[0_0_15px_rgba(77,77,255,0.3)]"></div>
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 border border-[#4D4DFF]/40 rounded-sm"></div>
                  <div className="absolute bottom-0 right-0 w-1/3 h-1/2 border border-[#4D4DFF]/40 rounded-sm"></div>
                </div>
                
                {/* Quantum particle effect */}
                <div className="absolute top-[70%] left-[20%] animate-float-delay-3" style={{animationDuration: '7s'}}>
                  <div className="w-3 h-3 bg-[#00F6C5]/70 rounded-full shadow-[0_0_15px_rgba(0,246,197,0.7)] animate-pulse"></div>
                  <div className="absolute -inset-2 border border-[#00F6C5]/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute -inset-4 border border-[#00F6C5]/20 rounded-full animate-spin-reverse-slow"></div>
                </div>
              </div>
              
              {/* Main AI assistant image with enhanced glow */}
              <div className="relative flex items-center w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4D4DFF]/20 via-[#9C42F5]/25 to-[#01CDFE]/20 rounded-3xl blur-3xl opacity-80 animate-pulse-slow"></div>
                <div className="relative z-10 overflow-visible flex items-center justify-center">
                  <Image
                    src={robotAi}
                    alt="AI Interview Assistant"
                    width={500}
                    height={500}
                    className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] object-contain drop-shadow-[0_0_40px_rgba(1,205,254,0.5)] transform translate-x-4 sm:translate-x-8 md:translate-x-0 lg:translate-x-0"
                  />
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>
      
 
      
      {/* Performance Tab */}
      <PerformanceTab />
    </main>
  );
};

export default HomePage;
