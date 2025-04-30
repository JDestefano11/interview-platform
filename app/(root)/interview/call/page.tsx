"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mic, MicOff, Video, VideoOff, MessageSquare, User, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Define interview question type
interface InterviewQuestion {
  id: number;
  question: string;
  type: string;
}

// Sample interview questions by type
const sampleQuestions: Record<string, InterviewQuestion[]> = {
  "Frontend Developer": [
    { id: 1, question: "Explain the difference between flexbox and grid in CSS.", type: "technical" },
    { id: 2, question: "How do you optimize website performance?", type: "technical" },
    { id: 3, question: "Explain your approach to responsive design.", type: "technical" },
    { id: 4, question: "What's your experience with modern JavaScript frameworks?", type: "experience" },
    { id: 5, question: "Describe a challenging project you worked on and how you solved the problems.", type: "behavioral" }
  ],
  "Backend Developer": [
    { id: 1, question: "Explain RESTful API design principles.", type: "technical" },
    { id: 2, question: "How do you handle database optimization?", type: "technical" },
    { id: 3, question: "Describe your experience with server-side caching.", type: "experience" },
    { id: 4, question: "How do you approach API security?", type: "technical" },
    { id: 5, question: "Tell me about a time you had to refactor a complex backend system.", type: "behavioral" }
  ],
  "Full Stack Developer": [
    { id: 1, question: "How do you manage state between frontend and backend?", type: "technical" },
    { id: 2, question: "Explain your experience with full-stack debugging.", type: "experience" },
    { id: 3, question: "How do you decide which tasks should be handled by frontend vs backend?", type: "technical" },
    { id: 4, question: "Describe your experience with deployment pipelines.", type: "experience" },
    { id: 5, question: "Tell me about a full-stack project you're particularly proud of.", type: "behavioral" }
  ],
  "DevOps Engineer": [
    { id: 1, question: "Explain your experience with CI/CD pipelines.", type: "experience" },
    { id: 2, question: "How do you approach infrastructure as code?", type: "technical" },
    { id: 3, question: "Describe your experience with container orchestration.", type: "experience" },
    { id: 4, question: "How do you handle monitoring and alerting?", type: "technical" },
    { id: 5, question: "Tell me about a time you improved deployment reliability.", type: "behavioral" }
  ],
  "Data Scientist": [
    { id: 1, question: "Explain your approach to feature engineering.", type: "technical" },
    { id: 2, question: "How do you validate machine learning models?", type: "technical" },
    { id: 3, question: "Describe your experience with big data technologies.", type: "experience" },
    { id: 4, question: "How do you communicate technical findings to non-technical stakeholders?", type: "soft skills" },
    { id: 5, question: "Tell me about a data project that delivered significant business value.", type: "behavioral" }
  ]
};

// Fallback responses for the interviewer
const fallbackResponses = [
  "Thank you for sharing your perspective. Let's move on to the next question.",
  "I appreciate your detailed answer. Let's continue with the next topic.",
  "That's an interesting approach. Now, let's discuss something else.",
  "Thanks for explaining that. Let's move forward to the next question.",
  "I understand your point of view. Let's proceed to the next area I'd like to explore."
];

export default function InterviewCallPage() {
  const router = useRouter();
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [interviewType, setInterviewType] = useState("Frontend Developer");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [responses, setResponses] = useState<{[key: number]: string}>({});
  const [interviewerResponse, setInterviewerResponse] = useState("");
  const [showInterviewerResponse, setShowInterviewerResponse] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer for call duration
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCallActive]);
  
  // Load interview data on component mount
  useEffect(() => {
    // Get interview config from localStorage
    const configString = localStorage.getItem("interviewConfig");
    if (configString) {
      try {
        const config = JSON.parse(configString);
        setInterviewType(config.interviewType || "Frontend Developer");
        setExperienceLevel(config.experienceLevel || "Intermediate");
        setTechnologies(config.technologies || []);
        setTotalQuestions(config.questionCount || 5);
      } catch (e) {
        console.error("Error parsing interview config:", e);
      }
    }
  }, []);
  
  // Get random interviewer response
  const getRandomResponse = (isLastQuestion: boolean): string => {
    if (isLastQuestion) {
      return "Thank you for all your responses. That concludes our interview today. We appreciate your time and insights.";
    }
    
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
  };
  
  // Start the interview call
  const startCall = () => {
    setIsLoading(true);
    
    try {
      // Get questions for the selected interview type
      const typeQuestions = sampleQuestions[interviewType] || sampleQuestions["Frontend Developer"];
      
      // Take only the requested number of questions
      const selectedQuestions = typeQuestions.slice(0, totalQuestions);
      
      setQuestions(selectedQuestions);
      
      // Set the first question
      if (selectedQuestions.length > 0) {
        setCurrentQuestion(selectedQuestions[0]);
        setIsCallActive(true);
        setQuestionNumber(1);
        
        // Show welcome message
        setInterviewerResponse(`Welcome to your ${interviewType} interview. I'll be asking you ${totalQuestions} questions about your experience and skills. Let's begin with the first question.`);
        setShowInterviewerResponse(true);
        
        // After showing the welcome message, hide it after 5 seconds
        setTimeout(() => {
          setShowInterviewerResponse(false);
        }, 5000);
      } else {
        setError("Failed to start interview. Please try again.");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // End the interview call
  const endCall = () => {
    setIsCallActive(false);
    setTimeElapsed(0);
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setUserResponse("");
    setInterviewerResponse("");
    setShowInterviewerResponse(false);
    
    // Navigate back to setup
    router.push('/interview/setup');
  };
  
  // Move to the next question
  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) return;
    
    setIsLoading(true);
    try {
      // Get the next question
      if (questionNumber < questions.length) {
        const nextQuestion = questions[questionNumber];
        
        // Update state with the new question
        setCurrentQuestion(nextQuestion);
        setQuestionNumber(prev => prev + 1);
        setUserResponse("");
        setShowInterviewerResponse(false);
      }
    } catch (error) {
      console.error("Error getting next question:", error);
      setError("Failed to get next question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit the user's response
  const submitResponse = () => {
    if (!userResponse.trim() || !isCallActive) return;
    
    setIsLoading(true);
    
    try {
      // Save the user's response
      const updatedResponses = { ...responses };
      updatedResponses[questionNumber - 1] = userResponse;
      setResponses(updatedResponses);
      
      // Generate interviewer response
      const isLastQuestion = questionNumber >= totalQuestions;
      const response = getRandomResponse(isLastQuestion);
      setInterviewerResponse(response);
      setShowInterviewerResponse(true);
      
      // Process after feedback
      setTimeout(() => {
        setShowInterviewerResponse(false);
        
        if (questionNumber < totalQuestions) {
          // Move to the next question
          nextQuestion();
        } else {
          setUserResponse("");
          setIsCallActive(false);
          setError("Interview complete! Thank you for your time.");
        }
      }, 3000);
    } catch (error) {
      console.error("Error recording response:", error);
      setError("Failed to record response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A101F] text-white flex flex-col">
      {/* Header with improved centered layout */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0E1428]/95 via-[#1A2138]/95 to-[#0E1428]/95 backdrop-blur-md border-b border-[#2A3A64]/30 shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex items-center w-1/3">
            <Button 
              variant="ghost" 
              className="text-[#8BA3C7] hover:text-white hover:bg-[#1A2138]/50 transition-all duration-200 group"
              onClick={() => router.push('/interview/setup')}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center w-1/3">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] font-bold text-xl">Interview</div>
          </div>
          
          <div className="flex items-center justify-end w-1/3">
            {isCallActive && (
              <div className="bg-[#1A2138] px-3 py-1 rounded-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#FF3864] mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col p-4 pt-20 w-full relative overflow-hidden">
        
        {/* Call controls placeholder - controls moved to the bottom of the video panel */}
        
        {/* Redesigned interview layout with transcript */}
        {isCallActive && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Video call interface */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Video panels */}
              <div className="flex flex-col gap-4 h-full">
                {/* AI Interviewer side */}
                <div className="min-h-[35vh] relative">
                  <div 
                    ref={videoRef}
                    className={cn(
                      "relative w-full h-full rounded-xl overflow-hidden bg-[#1A2138] border border-[#2A3A64] shadow-lg flex items-center justify-center",
                      isCallActive ? "" : "opacity-80"
                    )}
                  >
                    {/* Enhanced AI Interviewer avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] flex items-center justify-center shadow-[0_0_40px_rgba(1,205,254,0.4)]">
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-[#1A2138] opacity-30"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="h-28 w-28 text-white opacity-80">
                              <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8Z" />
                              <path d="M20 2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8Z" />
                              <path d="M20 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h16Z" />
                              <path d="M6 8v8" />
                              <path d="M18 8v8" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M10 16.5V17a2 2 0 1 0 4 0v-.5" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#01CDFE] flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interviewer name label */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                      <div className="w-2 h-2 rounded-full bg-[#01CDFE] mr-2 animate-pulse"></div>
                      <span className="text-white font-medium">AI Interviewer</span>
                    </div>
                    
                    {/* Interviewer response overlay */}
                    {showInterviewerResponse && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-[#1A2138]/80 rounded-lg p-5 max-w-xl border border-[#2A3A64] shadow-lg">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                              AI
                            </div>
                            <div className="ml-2 text-sm text-[#8BA3C7]">AI Interviewer</div>
                          </div>
                          <p className="text-white text-lg">{interviewerResponse}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* User side */}
                <div className="min-h-[35vh] relative">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0E1428] border border-[#1A2138] shadow-lg flex items-center justify-center">
                    {/* Enhanced User avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-[#2A3A64] to-[#4A5578] flex items-center justify-center shadow-[0_0_30px_rgba(42,58,100,0.4)]">
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-[#0E1428] opacity-30"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="h-28 w-28 text-[#8BA3C7] opacity-80">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
                      </div>
                    </div>
                    
                    {/* User name label */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                      <span className="text-white font-medium">You</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* End call button */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-14 h-14 border-2 bg-[#FF3864] border-[#FF3864] text-white hover:bg-[#FF3864]/80 shadow-[0_0_15px_rgba(255,56,100,0.3)]"
                  onClick={endCall}
                >
                  <Phone className="h-6 w-6 rotate-135" />
                </Button>
              </div>
            </div>
            
            {/* Right column - Transcript panel */}
            <div className="lg:col-span-1 bg-gradient-to-b from-[#0E1428]/90 to-[#1A2138]/90 border border-[#2A3A64]/50 rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-[#2A3A64]/50 bg-[#1A2138]/50 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] to-[#9C42F5]">Interview Transcript</h3>
                <p className="text-[#8BA3C7] text-xs">Question {questionNumber} of {totalQuestions}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Welcome message */}
                <div className="bg-[#1A2138]/50 p-3 rounded-lg border border-[#2A3A64]/30">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <p className="text-[#8BA3C7] text-xs">AI Interviewer</p>
                  </div>
                  <p className="text-white text-sm">Welcome to your interview. I'll be asking you questions about {interviewType}.</p>
                </div>
                
                {/* Question and answer pairs */}
                {Object.entries(responses).map(([questionIdx, response]) => (
                  <div key={questionIdx} className="space-y-3">
                    <div className="bg-[#1A2138]/50 p-3 rounded-lg border border-[#2A3A64]/30">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <p className="text-[#8BA3C7] text-xs">Question {parseInt(questionIdx) + 1}</p>
                      </div>
                      <p className="text-white text-sm">{questions[parseInt(questionIdx)]?.question}</p>
                    </div>
                    <div className="bg-[#01CDFE]/10 p-3 rounded-lg border border-[#01CDFE]/20 ml-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2">
                          <span className="text-[#8BA3C7] text-xs font-bold">You</span>
                        </div>
                        <p className="text-[#8BA3C7] text-xs">Your Response</p>
                      </div>
                      <p className="text-white text-sm">{response}</p>
                    </div>
                  </div>
                ))}
                
                {/* Current question indicator if no response yet */}
                {currentQuestion && !responses[questionNumber - 1] && (
                  <div className="bg-[#1A2138]/50 p-3 rounded-lg border border-[#2A3A64]/30 relative">
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#01CDFE] to-[#9C42F5] rounded-full"></div>
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <p className="text-[#8BA3C7] text-xs">Current Question</p>
                    </div>
                    <p className="text-white text-sm">{currentQuestion.question}</p>
                  </div>
                )}
              </div>
              
              {/* Voice input status area */}
              <div className="p-4 border-t border-[#2A3A64]/50 bg-[#1A2138]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#01CDFE] mr-2 animate-pulse"></div>
                    <span className="text-[#8BA3C7] text-sm">Voice input active</span>
                  </div>
                  
                  {/* Voice status indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 h-3 bg-[#01CDFE] rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s`, height: `${Math.max(3, Math.random() * 12)}px` }}
                        ></div>
                      ))}
                    </div>
                    <Button
                      onClick={submitResponse}
                      className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white rounded-full p-2 hover:opacity-90 shadow-[0_0_10px_rgba(1,205,254,0.3)]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Start Interview Button - only shown when call is not active */}
        {!isCallActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A101F]/70 backdrop-blur-sm z-10 p-4 overflow-y-auto">
            <div className="text-center mb-6 max-w-md">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] bg-clip-text text-transparent">
                {interviewType} Interview
              </h1>
              <p className="text-[#8BA3C7] mb-1">{experienceLevel} Level</p>
              <p className="text-[#E2F0FF] text-sm">
                {technologies.length > 0 ? technologies.join(' • ') : 'General interview'}
              </p>
              <p className="mt-4 text-[#8BA3C7]">
                You'll be interviewed by our AI assistant who will ask you {totalQuestions} questions.
              </p>
            </div>
            
            {/* Interview Guidelines Card */}
            <div className="mb-6 max-w-2xl w-full bg-gradient-to-r from-[#0E1428]/90 to-[#1A2138]/90 backdrop-blur-md rounded-xl border border-[#2A3A64] shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-[#01CDFE] via-[#4D4DFF] to-[#9C42F5]">
                <div className="bg-[#0E1428]/95 p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#4D4DFF] flex items-center justify-center shadow-[0_0_15px_rgba(1,205,254,0.5)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    </div>
                    <h2 className="ml-3 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] to-[#9C42F5]">
                      Interview Guidelines
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#8BA3C7] text-sm">
                    <div className="flex">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#01CDFE] text-xs font-bold">1</span>
                      </div>
                      <p><span className="text-white font-medium">Prepare your environment:</span> Find a quiet space with good lighting.</p>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#01CDFE] text-xs font-bold">2</span>
                      </div>
                      <p><span className="text-white font-medium">Be authentic:</span> Answer as you would in a real interview.</p>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#01CDFE] text-xs font-bold">3</span>
                      </div>
                      <p><span className="text-white font-medium">Take your time:</span> Think through your responses carefully.</p>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#01CDFE] text-xs font-bold">4</span>
                      </div>
                      <p><span className="text-white font-medium">Use the chat:</span> Type clear and concise responses.</p>
                    </div>
                    
                    <div className="flex md:col-span-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#01CDFE] text-xs font-bold">5</span>
                      </div>
                      <p><span className="text-white font-medium">Complete the session:</span> Try to finish all questions in one sitting for the best experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={startCall}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white font-medium py-3 px-8 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg text-lg"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Starting Interview...</span>
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />
                  <span>Start Interview</span>
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#FF3864]/10 border border-[#FF3864]/30 rounded-lg z-50">
            <p className="text-[#FF3864] text-center">{error}</p>
          </div>
        )}
      </main>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(1, 205, 254, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(1, 205, 254, 0); }
          100% { box-shadow: 0 0 0 0 rgba(1, 205, 254, 0); }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
