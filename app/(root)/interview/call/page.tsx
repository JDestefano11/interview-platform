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
      {/* Header with minimal controls */}
      <header className="p-4 flex items-center justify-between bg-[#0E1428] border-b border-[#1A2138]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/interview/setup')}
          className="text-[#8BA3C7] hover:text-white hover:bg-[#1A2138]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center">
          {isCallActive && (
            <div className="bg-[#1A2138] px-3 py-1 rounded-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#FF3864] mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>
        
        <div>
          {/* Empty div to maintain spacing */}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col p-4 w-full relative overflow-hidden">
        {/* Split screen video call layout */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
          {/* AI Interviewer side */}
          <div className="flex-1 min-h-[40vh] md:min-h-[60vh] relative">
            {/* AI Interviewer video placeholder */}
            <div 
              ref={videoRef}
              className={cn(
                "relative w-full h-full rounded-xl overflow-hidden bg-[#1A2138] border border-[#2A3A64] shadow-lg flex items-center justify-center",
                isCallActive ? "" : "opacity-80"
              )}
            >
              {/* Interviewer avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] flex items-center justify-center shadow-[0_0_30px_rgba(1,205,254,0.3)]">
                  <User className="h-14 w-14 text-white" />
                </div>
              </div>
              
              {/* Interviewer name label */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#01CDFE] mr-2 animate-pulse"></div>
                <span className="text-white font-medium">AI Interviewer</span>
              </div>
              
              {/* Current question overlay - only shown when call is active */}
              {isCallActive && currentQuestion && !showInterviewerResponse && (
                <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-[#2A3A64]/50">
                  <div className="flex items-center mb-1">
                    <div className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {questionNumber}
                    </div>
                    <div className="ml-2 text-xs text-[#8BA3C7]">Question {questionNumber} of {totalQuestions}</div>
                  </div>
                  <p className="text-white text-sm md:text-base">{currentQuestion.question}</p>
                </div>
              )}
              
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
          <div className="flex-1 min-h-[40vh] md:min-h-[60vh] relative">
            {/* User video placeholder */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0E1428] border border-[#1A2138] shadow-lg flex items-center justify-center">
              {/* User avatar/silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-r from-[#2A3A64] to-[#4A5578] flex items-center justify-center">
                  <User className="h-14 w-14 text-[#8BA3C7]" />
                </div>
              </div>
              
              {/* User name label */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                <span className="text-white font-medium">You</span>
              </div>
              
              {/* Muted indicator when mic is off */}
              {!isMicOn && isCallActive && (
                <div className="absolute top-4 right-4 bg-[#FF3864]/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                  <MicOff className="h-4 w-4 text-white mr-1" />
                  <span className="text-white text-xs">Muted</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Call controls - only visible when call is active */}
        {isCallActive && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full w-12 h-12 border-2", 
                isMicOn ? "bg-[#1A2138] border-[#01CDFE] text-[#01CDFE]" : "bg-[#FF3864] border-[#FF3864] text-white"
              )}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full w-12 h-12 border-2", 
                isVideoOn ? "bg-[#1A2138] border-[#01CDFE] text-[#01CDFE]" : "bg-[#FF3864] border-[#FF3864] text-white"
              )}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 bg-[#FF3864] border-[#FF3864] text-white hover:bg-[#FF3864]/80"
              onClick={endCall}
            >
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full w-12 h-12 border-2", 
                isChatOpen ? "bg-[#01CDFE] border-[#01CDFE] text-white" : "bg-[#1A2138] border-[#2A3A64] text-[#8BA3C7] hover:border-[#01CDFE] hover:text-[#01CDFE]"
              )}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Chat/response panel - only shown when chat is open */}
        {isCallActive && isChatOpen && (
          <div className="mt-4 w-full bg-[#0E1428] border border-[#1A2138] rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="p-3 border-b border-[#1A2138] flex items-center justify-between">
              <h3 className="text-[#E2F0FF] font-medium">Interview Chat</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#8BA3C7] hover:text-white hover:bg-[#1A2138] h-8 w-8"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[300px]">
              {/* Chat history */}
              <div className="bg-[#1A2138]/50 p-3 rounded-lg">
                <p className="text-[#8BA3C7] text-xs mb-1">AI Interviewer</p>
                <p className="text-white text-sm">Welcome to your interview. I'll be asking you questions about {interviewType}.</p>
              </div>
              
              {Object.entries(responses).map(([questionIdx, response]) => (
                <div key={questionIdx} className="space-y-3">
                  <div className="bg-[#1A2138]/50 p-3 rounded-lg">
                    <p className="text-[#8BA3C7] text-xs mb-1">AI Interviewer</p>
                    <p className="text-white text-sm">{questions[parseInt(questionIdx)]?.question}</p>
                  </div>
                  <div className="bg-[#01CDFE]/10 p-3 rounded-lg ml-4">
                    <p className="text-[#8BA3C7] text-xs mb-1">You</p>
                    <p className="text-white text-sm">{response}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-[#1A2138]">
              <div className="relative">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-[#1A2138] border border-[#2A3A64] rounded-lg p-3 pr-12 text-white placeholder-[#4A5578] min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#01CDFE]/50 text-sm"
                />
                <Button
                  onClick={submitResponse}
                  disabled={!userResponse.trim() || isLoading}
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white rounded-full p-2 hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
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
