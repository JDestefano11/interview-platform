"use client";

import React, { useEffect, useState } from 'react'
import Agent from '@/components/Agent'
import { Briefcase, Clock, Calendar, ChevronLeft, Settings } from 'lucide-react'

const InterviewPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTips, setShowTips] = useState(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A18] via-[#0E1428] to-[#1A2138]">
      {/* Top navigation bar */}
      <div className="bg-[#050A18]/80 backdrop-blur-md border-b border-[#1A2138] sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-center">
          <h1 className="text-xl font-bold text-[#E2F0FF]">Interview Session</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="hidden lg:block">
            <div className="bg-[#0E1428]/80 backdrop-blur-md border border-[#1A2138] rounded-xl p-6 shadow-lg mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="text-[#01CDFE]" size={20} />
                <h2 className="text-lg font-medium text-[#E2F0FF]">Interview Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-[#8BA3C7] mb-1">Position</h3>
                  <p className="text-[#E2F0FF] font-medium">Full Stack Developer</p>
                </div>
                <div>
                  <h3 className="text-sm text-[#8BA3C7] mb-1">Company</h3>
                  <p className="text-[#E2F0FF] font-medium">TechCorp Industries</p>
                </div>
                <div>
                  <h3 className="text-sm text-[#8BA3C7] mb-1">Interview Type</h3>
                  <p className="text-[#E2F0FF] font-medium">Technical Assessment</p>
                </div>
                <div>
                  <h3 className="text-sm text-[#8BA3C7] mb-1">Duration</h3>
                  <p className="text-[#E2F0FF] font-medium">30 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main call area */}
          <div className="lg:col-span-2">
            <Agent userName="You" userId="user1" type="generate" />
            
            {/* Interview tips */}
            {showTips && (
              <div className="mt-6 bg-[#0E1428]/80 backdrop-blur-md border border-[#1A2138] rounded-xl p-6 shadow-lg relative">
                <button 
                  onClick={() => setShowTips(false)}
                  className="absolute top-4 right-4 text-[#8BA3C7] hover:text-[#E2F0FF] transition-colors"
                >
                  ×
                </button>
                <h3 className="text-lg font-medium text-[#E2F0FF] mb-3">Interview Tips</h3>
                <ul className="space-y-2 text-[#8BA3C7]">
                  <li className="flex items-start">
                    <span className="text-[#00F6C5] mr-2">•</span>
                    <span>Speak clearly and at a moderate pace for best results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#01CDFE] mr-2">•</span>
                    <span>Take a moment to think before answering complex questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#9C42F5] mr-2">•</span>
                    <span>Use specific examples from your experience when possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#4D4DFF] mr-2">•</span>
                    <span>If you need the question repeated, simply ask the interviewer</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
