'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, Award, Target, BrainCircuit, ChevronUp, ChevronDown } from 'lucide-react';

// Mock data for performance metrics
const performanceData = [
  { category: 'Technical Knowledge', score: 85 },
  { category: 'Problem Solving', score: 78 },
  { category: 'Communication', score: 92 },
  { category: 'System Design', score: 70 },
  { category: 'Code Quality', score: 88 },
];

// Mock data for interview history
const interviewHistory = [
  { id: 1, date: 'Apr 10', company: 'Apple', score: 65 },
  { id: 2, date: 'Apr 15', company: 'Netflix', score: 72 },
  { id: 3, date: 'Apr 18', company: 'Spotify', score: 68 },
  { id: 4, date: 'Apr 21', company: 'Tesla', score: 80 },
  { id: 5, date: 'Apr 23', company: 'Apple', score: 85 },
];

// Colors for the charts
const COLORS = ['#4D4DFF', '#01CDFE', '#9C42F5', '#00F6C5', '#FF3864'];

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A2138]/95 backdrop-blur-sm p-4 border border-[#4D4DFF]/30 rounded-lg shadow-lg">
        <p className="text-[#E2F0FF] font-medium text-sm mb-1">{label}</p>
        <p className="text-[#01CDFE] font-semibold text-base">Score: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function PerformanceTab() {
  // Add padding to the bottom of the page when component mounts
  React.useEffect(() => {
    // Add padding to the bottom of the main content to ensure cards are fully visible
    document.body.style.paddingBottom = '120px';
    
    // Also add margin to the main element to prevent content from being hidden
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.marginBottom = '80px';
    }
    
    return () => {
      // Clean up when component unmounts
      document.body.style.paddingBottom = '0';
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.marginBottom = '0';
      }
    };
  }, []);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate average score
  const averageScore = Math.round(
    interviewHistory.reduce((sum, interview) => sum + interview.score, 0) / interviewHistory.length
  );

  // Calculate improvement
  const improvement = interviewHistory[interviewHistory.length - 1].score - interviewHistory[0].score;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E1428]/95 backdrop-blur-lg border-t border-[#4D4DFF]/30 shadow-[0_-5px_25px_rgba(77,77,255,0.15)] max-h-[90vh] overflow-y-auto">
      {/* Tab header - always visible */}
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 bg-[#4D4DFF]/10">
            <BrainCircuit className="w-5 h-5 text-[#4D4DFF]" />
          </div>
          <div>
            <h3 className="text-[#E2F0FF] font-semibold text-lg">Performance Dashboard</h3>
            <p className="text-[#8BA3C7] text-sm">View your interview performance metrics</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="hidden sm:flex items-center space-x-6 mr-8">
            <div className="text-center">
              <p className="text-[#8BA3C7] text-xs">Interviews</p>
              <p className="text-[#E2F0FF] font-semibold">{interviewHistory.length}</p>
            </div>
            
            <div className="text-center">
              <p className="text-[#8BA3C7] text-xs">Avg. Score</p>
              <p className="text-[#E2F0FF] font-semibold">{averageScore}%</p>
            </div>
            
            <div className="text-center">
              <p className="text-[#8BA3C7] text-xs">Improvement</p>
              <p className={`font-semibold ${improvement >= 0 ? 'text-[#00F6C5]' : 'text-[#FF3864]'}`}>
                {improvement > 0 ? '+' : ''}{improvement}%
              </p>
            </div>
          </div>
          
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1A2138] border border-[#4D4DFF]/30">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-[#8BA3C7]" />
            ) : (
              <ChevronUp className="w-5 h-5 text-[#8BA3C7]" />
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance by category */}
            <div className="bg-[#1A2138]/80 backdrop-blur-sm border border-[#4D4DFF]/20 rounded-xl p-5">
              <h4 className="text-[#E2F0FF] font-medium mb-4">Performance by Category</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4D4DFF30" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fill: '#E2F0FF' }} 
                      tickLine={{ stroke: '#4D4DFF40' }}
                      axisLine={{ stroke: '#4D4DFF40' }}
                      height={60}
                      angle={-45}
                      textAnchor="end"
                      scale="band"
                      interval={0}
                      fontSize={10}
                    />
                    <YAxis 
                      tick={{ fill: '#E2F0FF' }} 
                      tickLine={{ stroke: '#4D4DFF40' }}
                      axisLine={{ stroke: '#4D4DFF40' }}
                      domain={[0, 100]} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={20}>
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Interview history trend */}
            <div className="bg-[#1A2138]/80 backdrop-blur-sm border border-[#4D4DFF]/20 rounded-xl p-5">
              <h4 className="text-[#E2F0FF] font-medium mb-4">Progress Over Time</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={interviewHistory}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4D4DFF30" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#E2F0FF' }} 
                      tickLine={{ stroke: '#4D4DFF40' }}
                      axisLine={{ stroke: '#4D4DFF40' }}
                    />
                    <YAxis 
                      tick={{ fill: '#E2F0FF' }} 
                      tickLine={{ stroke: '#4D4DFF40' }}
                      axisLine={{ stroke: '#4D4DFF40' }}
                      domain={[0, 100]} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A2138', 
                        borderColor: '#4D4DFF40',
                        borderRadius: '8px',
                        padding: '10px',
                        color: '#E2F0FF'
                      }}
                      formatter={(value: any) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => {
                        const interview = interviewHistory.find(i => i.date === label);
                        return `${interview?.company} (${label})`;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#01CDFE" 
                      strokeWidth={3}
                      dot={{ 
                        fill: '#1A2138', 
                        stroke: '#01CDFE', 
                        strokeWidth: 2, 
                        r: 6 
                      }}
                      activeDot={{ 
                        fill: '#01CDFE', 
                        stroke: '#1A2138', 
                        strokeWidth: 2, 
                        r: 8,
                        strokeDasharray: ''
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Key insights */}
            <div className="bg-[#1A2138]/80 backdrop-blur-sm border border-[#4D4DFF]/20 rounded-xl p-5">
              <h4 className="text-[#E2F0FF] font-medium mb-4">Key Insights</h4>
              
              <div className="space-y-4">
                <div className="bg-[#0E1428]/70 backdrop-blur-sm rounded-lg p-4 border border-[#4D4DFF]/20">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#00F6C5]/10 flex items-center justify-center mr-3 mt-0.5">
                      <Award className="w-4 h-4 text-[#00F6C5]" />
                    </div>
                    <div>
                      <p className="text-[#E2F0FF] text-sm font-medium">Strength: Communication</p>
                      <p className="text-[#8BA3C7] text-xs mt-1">Your ability to explain complex concepts clearly stands out.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0E1428]/70 backdrop-blur-sm rounded-lg p-4 border border-[#4D4DFF]/20">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#FF3864]/10 flex items-center justify-center mr-3 mt-0.5">
                      <Target className="w-4 h-4 text-[#FF3864]" />
                    </div>
                    <div>
                      <p className="text-[#E2F0FF] text-sm font-medium">Focus Area: System Design</p>
                      <p className="text-[#8BA3C7] text-xs mt-1">Improving this skill could boost your overall performance by 15%.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0E1428]/70 backdrop-blur-sm rounded-lg p-4 border border-[#4D4DFF]/20">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#01CDFE]/10 flex items-center justify-center mr-3 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-[#01CDFE]" />
                    </div>
                    <div>
                      <p className="text-[#E2F0FF] text-sm font-medium">Progress: +{improvement}%</p>
                      <p className="text-[#8BA3C7] text-xs mt-1">Your performance has improved since your first interview.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0E1428]/70 backdrop-blur-sm rounded-lg p-4 border border-[#4D4DFF]/20">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#9C42F5]/10 flex items-center justify-center mr-3 mt-0.5">
                      <BrainCircuit className="w-4 h-4 text-[#9C42F5]" />
                    </div>
                    <div>
                      <p className="text-[#E2F0FF] text-sm font-medium">AI Recommendation</p>
                      <p className="text-[#8BA3C7] text-xs mt-1">Focus on improving your System Design skills to maximize your interview performance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
