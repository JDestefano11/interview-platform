"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mic, MicOff, Video, VideoOff, MessageSquare, User, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/utilis/useSpeechSynthesis";
import { useSpeechRecognition } from "@/utilis/useSpeechRecognition";
import { generateGeminiQuestion, generateGeminiFeedback, generateGeminiIntroduction } from "@/utilis/gemini";

export default function InterviewCallPage() {
  const router = useRouter();
  const {
    speakText,
    isSpeaking,
    aiHasFinishedSpeaking,
    setAiHasFinishedSpeaking,
    init
  } = useSpeechSynthesis();

  // Speech recognition hook
  const {
    isListening,
    liveTranscript,
    startRecognition,
    stopRecognition,
    setLiveTranscript
  } = useSpeechRecognition();

  // Track the last spoken text to prevent repetition
  const [lastSpokenText, setLastSpokenText] = useState("");
  
  // Force the next step after speech finishes
  const forceNextStep = useRef(false);

  // Memoize the speakText function to prevent it from changing between renders
  const memoizedSpeakText = useCallback((text: string, nextStep?: string) => {
    // Skip if the text is empty, already speaking, or this exact text was just spoken
    if (!text || isSpeaking || text === lastSpokenText) {
      console.log('Skipping speech: empty, already speaking, or duplicate text');
      return;
    }
    
    console.log('Speaking text (length):', text.length);
    setLastSpokenText(text); // Track what we're speaking to prevent duplicates
    
    // If nextStep is provided, set the flag to force that step after speech
    if (nextStep) {
      forceNextStep.current = true;
      console.log(`Will force transition to ${nextStep} after speech`);
    }
    
    speakText(text);
  }, [speakText, isSpeaking, lastSpokenText]);

  const [userResponse, setUserResponse] = useState("");
  const [showInterviewerResponse, setShowInterviewerResponse] = useState(false);
  const [interviewerResponse, setInterviewerResponse] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [interviewStep, setInterviewStep] = useState<'idle' | 'introduction' | 'question' | 'listening' | 'feedback' | 'finished'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");

  const [hasSpokenIntroduction, setHasSpokenIntroduction] = useState(false);
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState(false);
  const [hasSpokenFeedback, setHasSpokenFeedback] = useState(false);

  const [username, setUsername] = useState<string>("");
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

 
  const [interviewInfo, setInterviewInfo] = useState({
    role: "Software Engineer", 
    technologies: ["React", "TypeScript"], 
    experienceLevel: "mid-level", 
    previousQuestions: previousQuestions,
    username: username, 
  });

  // Memoize the interview info to prevent it from changing between renders
  const [memoizedInterviewInfo, setMemoizedInterviewInfo] = useState({
    role: interviewInfo.role,
    technologies: interviewInfo.technologies,
    experienceLevel: interviewInfo.experienceLevel,
    previousQuestions: previousQuestions,
    username: username,
  });

  // Update the memoized interview info when the interview details change
  useEffect(() => {
    // Update the memoizedInterviewInfo when interviewInfo changes
    setMemoizedInterviewInfo({
      role: interviewInfo.role,
      technologies: interviewInfo.technologies,
      experienceLevel: interviewInfo.experienceLevel,
      previousQuestions: previousQuestions,
      username: username,
    });
  }, [interviewInfo, previousQuestions, username]);

  // Reset the speaking state when the interview step changes
  useEffect(() => {
    // When changing steps, reset the AI speaking finished state
    setAiHasFinishedSpeaking(false);
    console.log(`Interview step changed to: ${interviewStep}`);
  }, [interviewStep]);

  // Reset all state flags when starting a new call
  const handleStartCall = () => {
    if (!username) {
      setShowNameInput(true);
      return;
    }
    
    // Reset all state
    resetAllState();
    
    // Start the call
    setIsCallActive(true);
    setInterviewStep('introduction');
    console.log('Starting new interview with:', { role: interviewInfo.role, level: interviewInfo.experienceLevel, technologies: interviewInfo.technologies });
  };

  // Reset all state when ending a call
  const handleEndCall = () => {
    // Cancel any ongoing speech
    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    
    // Reset all state
    resetAllState();
    console.log('Interview ended, all state reset');
  };

  // Helper to reset all state (including hooks if possible)
  const resetAllState = () => {
    // Reset interview state
    setInterviewStep('idle');
    setIsCallActive(false);
    setCurrentQuestion("");
    setCurrentTranscript("");
    setUserResponse("");
    setShowInterviewerResponse(false);
    setInterviewerResponse("");
    setMicActive(false);
    setIsLoading(false);
    setAiHasFinishedSpeaking(false);
    setLiveTranscript("");
    
    // Reset flags to prevent repetition
    setHasSpokenIntroduction(false);
    setHasSpokenQuestion(false);
    setHasSpokenFeedback(false);
    setLastSpokenText("");
    
    // Reset speech synthesis
    if (typeof window !== 'undefined') {
      if (typeof window.speechSynthesis !== 'undefined') window.speechSynthesis.cancel();
    }
    
    // Reset previous questions to prevent repetition
    setPreviousQuestions([]);
  };

  // Timer for call duration
  useEffect(() => {
    if (isCallActive) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCallActive]);

  // Ensure speech synthesis is initialized on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      init();
    }
  }, []);

  // Reset all state on mount
  useEffect(() => {
    resetAllState();
  }, []);

  // Get username on mount if available
  useEffect(() => {
    // Try to get username from localStorage or session
    const storedUsername = typeof window !== 'undefined' ? 
      localStorage.getItem('username') || sessionStorage.getItem('username') : null;
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Get interview details from URL parameters or localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // First try to get parameters from URL
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role');
        const urlLevel = params.get('level');
        const urlTechnologies = params.get('technologies')?.split(',').filter(Boolean) || [];
        
        // If URL parameters exist, use them
        if (urlRole && urlLevel) {
          console.log('Using interview details from URL parameters');
          setInterviewInfo(prevInfo => ({
            ...prevInfo,
            role: urlRole,
            experienceLevel: urlLevel,
            technologies: urlTechnologies,
          }));
        } 
        // Otherwise try localStorage
        else {
          const savedDetails = localStorage.getItem('interviewDetails');
          if (savedDetails) {
            const details = JSON.parse(savedDetails);
            console.log('Using interview details from localStorage', details);
            setInterviewInfo(prevInfo => ({
              ...prevInfo,
              role: details.role || 'Software Developer',
              experienceLevel: details.experienceLevel || 'Intermediate',
              technologies: Array.isArray(details.technologies) ? details.technologies : [],
            }));
          }
        }
        
        // Get username from localStorage if available
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
          setUsername(savedUsername);
          setShowNameInput(false);
        } else {
          setShowNameInput(true);
        }
      } catch (error) {
        console.error('Error parsing interview details:', error);
        // Fallback to defaults
        setInterviewInfo(prevInfo => ({
          ...prevInfo,
          role: 'Software Developer',
          experienceLevel: 'Intermediate',
          technologies: ['JavaScript', 'React'],
        }));
      }
    }
  }, []);

  // Display the role and experience level in the UI
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Update the page title to reflect the interview type
      document.title = `AI Interview - ${interviewInfo.role}`;
      
      // Log the current interview details for debugging
      console.log('Current interview details:', {
        role: interviewInfo.role,
        experienceLevel: interviewInfo.experienceLevel,
        technologies: interviewInfo.technologies,
        username: username
      });
    }
  }, [interviewInfo, username]);

  // Handle name submission
  const handleNameSubmit = () => {
    if (nameInputRef.current && nameInputRef.current.value) {
      const newUsername = nameInputRef.current.value.trim();
      setUsername(newUsername);
      // Store in localStorage for future sessions
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', newUsername);
      }
    }
    setShowNameInput(false);
    
    // Start the interview with the new username
    resetAllState();
    setIsCallActive(true);
    setInterviewStep('introduction');
  };

  // Handle name submission with Enter key
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  // Introduction: Speak ONCE when step is 'introduction'
  useEffect(() => {
    if (
      isCallActive &&
      interviewStep === 'introduction' &&
      !hasSpokenIntroduction &&
      !isSpeaking &&
      !isLoading
    ) {
      setHasSpokenIntroduction(true);
      (async () => {
        setIsLoading(true);
        setAiHasFinishedSpeaking(false);
        const intro = await generateGeminiIntroduction({
          role: memoizedInterviewInfo.role,
          experienceLevel: memoizedInterviewInfo.experienceLevel,
          username: memoizedInterviewInfo.username
        });
        setIsLoading(false);
        setCurrentTranscript(intro);
        speakText(intro);
      })();
    }
  }, [isCallActive, interviewStep, hasSpokenIntroduction, isSpeaking, isLoading, speakText, memoizedInterviewInfo]);

  // Question: Speak ONCE when step is 'question'
  useEffect(() => {
    if (
      isCallActive &&
      interviewStep === 'question' &&
      !hasSpokenQuestion &&
      !isSpeaking &&
      !isLoading
    ) {
      setHasSpokenQuestion(true);
      (async () => {
        setIsLoading(true);
        setAiHasFinishedSpeaking(false);
        const q = await generateGeminiQuestion({ ...memoizedInterviewInfo, previousQuestions });
        setCurrentQuestion(q);
        setPreviousQuestions(prev => [...prev, q]);
        setIsLoading(false);
        setCurrentTranscript(q);
        speakText(q);
      })();
    }
  }, [isCallActive, interviewStep, hasSpokenQuestion, isSpeaking, isLoading, memoizedInterviewInfo, previousQuestions, speakText]);

  // Feedback: Speak ONCE when step is 'feedback'
  useEffect(() => {
    if (
      isCallActive &&
      interviewStep === 'feedback' &&
      !hasSpokenFeedback &&
      !isSpeaking &&
      !isLoading &&
      currentQuestion &&
      userResponse
    ) {
      setHasSpokenFeedback(true);
      (async () => {
        setIsLoading(true);
        setAiHasFinishedSpeaking(false);
        try {
          const feedback = await generateGeminiFeedback(
            {
              role: memoizedInterviewInfo.role,
              technologies: memoizedInterviewInfo.technologies,
              experienceLevel: memoizedInterviewInfo.experienceLevel,
            },
            currentQuestion,
            userResponse
          );
          setCurrentTranscript(feedback);
          speakText(feedback);
        } catch (err) {
          setCurrentTranscript('Sorry, there was an error generating feedback.');
          speakText('Sorry, there was an error generating feedback.');
        }
        setIsLoading(false);
      })();
    }
  }, [isCallActive, interviewStep, hasSpokenFeedback, isSpeaking, isLoading, currentQuestion, userResponse, memoizedInterviewInfo, speakText, setAiHasFinishedSpeaking]);

  // SINGLE SPEECH SYNTHESIS-DRIVEN TRANSITION EFFECT
  useEffect(() => {
    if (!aiHasFinishedSpeaking) return;
    if (!isCallActive) return;
    if (isSpeaking) return;
    if (isLoading) return;
    
    if (interviewStep === 'introduction' && hasSpokenIntroduction) {
      setInterviewStep('question');
      setAiHasFinishedSpeaking(false);
      setHasSpokenQuestion(false); // Allow question to trigger
      return;
    }
    if (interviewStep === 'question' && hasSpokenQuestion) {
      setInterviewStep('listening');
      setAiHasFinishedSpeaking(false);
      setMicActive(true);
      startRecognition();
      return;
    }
    if (interviewStep === 'feedback' && hasSpokenFeedback) {
      // Check if interview should continue or finish
      const maxQuestions = 5; 
      if (previousQuestions.length >= maxQuestions) {
        setInterviewStep('finished');
      } else {
        setInterviewStep('question');
        setHasSpokenQuestion(false);
        setHasSpokenFeedback(false);
        setUserResponse("");
      }
      setAiHasFinishedSpeaking(false);
    }
  }, [aiHasFinishedSpeaking, interviewStep, isCallActive, isSpeaking, isLoading, hasSpokenIntroduction, hasSpokenQuestion, hasSpokenFeedback, previousQuestions.length, startRecognition]);

  // When transcript is finalized, move to feedback
  useEffect(() => {
    if (
      isCallActive &&
      interviewStep === 'listening' &&
      userResponse &&
      !isSpeaking &&
      !isLoading
    ) {
      setInterviewStep('feedback');
      setHasSpokenFeedback(false);
    }
  }, [isCallActive, interviewStep, userResponse, isSpeaking, isLoading]);

  // Update transcript panel only after user finishes speaking
  useEffect(() => {
    if (interviewStep === 'feedback' && userResponse) {
      setCurrentTranscript(`You: ${userResponse}`);
    }
  }, [interviewStep, userResponse]);

  // Toggle microphone
  const toggleMicrophone = () => {
    if (!isCallActive || isSpeaking) return;
    if (micActive) {
      stopRecognition();
      setMicActive(false);
      // Only submit if liveTranscript has content
      if (liveTranscript.trim()) {
        handleSubmitResponse();
      }
    } else {
      if (!isListening) {
        setLiveTranscript("");
        setMicActive(true);
        startRecognition();
      } else {
        // Already listening, do nothing
        return;
      }
    }
  };

  // Submit the user's response
  const handleSubmitResponse = () => {
    if (!liveTranscript.trim() || !isCallActive || isSpeaking) return;
    setUserResponse(liveTranscript.trim());
    setLiveTranscript("");
    setMicActive(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                            <div className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_40px_rgba(1,205,254,0.4)]">
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
                            <span className="text-white font-medium">AI</span>
                          </div>
                          <p className="text-white">{interviewerResponse}</p>
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
                  onClick={handleEndCall}
                >
                  <Phone className="h-6 w-6 rotate-135" />
                </Button>
              </div>
            </div>
            
            {/* Right column - Transcript panel */}
            <div className="lg:col-span-1 bg-gradient-to-b from-[#0E1428]/90 to-[#1A2138]/90 border border-[#2A3A64]/50 rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-[#2A3A64]/50 bg-[#1A2138]/50 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-white mb-4">Interview Transcript</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Transcript content - initially empty, only shows after AI has finished speaking */}
                
                {/* Loading spinner */}
                {isLoading && (
                  <div className="text-lg text-[#01CDFE] animate-pulse mb-4">Loading...</div>
                )}
                {/* Introduction */}
                {interviewStep === 'introduction' && (
                  <div className="text-lg text-[#01CDFE] mb-4">AI: Introduction...</div>
                )}
                {/* Question */}
                {currentQuestion && (
                  <div className="text-lg text-[#01CDFE] mb-4">{currentQuestion}</div>
                )}
                {/* Listening state and transcript */}
                {interviewStep === 'listening' && (
                  <div className="mb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Listening...</span>
                      <span className="italic text-sm text-gray-400">(Speak your answer)</span>
                    </div>
                    <div className="bg-[#01CDFE]/5 p-3 rounded-lg border border-[#01CDFE]/10 animate-fade-in">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-2">
                          <span className="text-[#8BA3C7] text-xs font-bold">You</span>
                        </div>
                        <p className="text-[#8BA3C7] text-xs">Speaking...</p>
                      </div>
                      <p className="text-white min-h-[24px]">{liveTranscript || <span className="text-gray-500 italic">Start speaking to see your answer...</span>}</p>
                    </div>
                  </div>
                )}
                {/* Feedback */}
                {showInterviewerResponse && interviewerResponse && (
                  <div className="bg-[#2A3A64] rounded p-3 mb-4 w-full max-w-xl text-[#01CDFE]">{interviewerResponse}</div>
                )}
                {/* Interview complete message */}
                {interviewStep === 'finished' && (
                  <div className="text-xl font-bold mt-8">Interview Complete. Thank you!</div>
                )}
                {/* Start Interview Button */}
                {interviewStep === 'idle' && (
                  <Button
                    onClick={handleStartCall}
                    className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white font-medium py-3 px-8 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg text-lg"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Start Interview</span>
                  </Button>
                )}
                
                {/* Transcript Panel */}
                <div className="mt-4 p-3 bg-[#1A2138] rounded-lg text-white text-base min-h-[40px]">
                  {currentTranscript}
                </div>
              </div>
              
              {/* Voice input status area */}
              <div className="p-4 border-t border-[#2A3A64]/50 bg-[#1A2138]/30">
                {isCallActive ? (
                  <div className="flex flex-col items-center justify-center gap-2 w-full">
                    {/* Status indicators */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center">
                        {isListening ? (
                          <>
                            <div className="w-3 h-3 rounded-full bg-[#01CDFE] mr-2 animate-pulse"></div>
                            <span className="text-[#8BA3C7] text-sm">Listening...</span>
                          </>
                        ) : isSpeaking ? (
                          <>
                            <div className="w-3 h-3 rounded-full bg-[#FF3864] mr-2 animate-pulse"></div>
                            <span className="text-[#8BA3C7] text-sm">AI is speaking</span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 rounded-full bg-[#2A3A64] mr-2"></div>
                            <span className="text-[#8BA3C7] text-sm">Ready</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Live transcript display */}
                    <div className="relative w-full">
                      {liveTranscript ? (
                        <div className="p-4 bg-[#1A2138] rounded-lg border border-[#2A3A64] text-[#8BA3C7] text-sm min-h-[100px]">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-[#01CDFE]">Your Response:</p>
                            {micActive && (
                              <span className="text-xs text-[#FF3864] flex items-center">
                                <span className="w-2 h-2 rounded-full bg-[#FF3864] mr-1 animate-pulse"></span>
                                Recording...
                              </span>
                            )}
                          </div>
                          <p className="text-white">{liveTranscript}</p>
                          {userResponse && <p className="text-[#8BA3C7] italic mt-1">{userResponse}...</p>}
                          {micActive && liveTranscript && (
                            <div className="mt-3 text-xs text-[#8BA3C7] italic">
                              Click the microphone button again when you're finished to submit your response
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-[#1A2138] rounded-lg border border-[#2A3A64] text-[#8BA3C7] text-sm min-h-[100px] flex items-center justify-center">
                          {isSpeaking ? (
                            <p>AI interviewer is speaking...</p>
                          ) : micActive ? (
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className="w-1 bg-[#01CDFE] rounded-full animate-pulse"
                                      style={{ height: `${Math.max(3, Math.random() * 12)}px`, animationDelay: `${i * 0.15}s` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                              <p>Speak now... your response will appear here</p>
                            </div>
                          ) : (
                            <p>Click the microphone button to start speaking</p>
                          )}
                        </div>
                      )}
                      
                      {/* Microphone button with enhanced visual cue */}
                      <button
                        className={`absolute right-3 bottom-3 p-3 rounded-full ${micActive ? 'bg-[#FF3864] hover:bg-[#FF3864]/80' : 'bg-[#01CDFE] hover:bg-[#01CDFE]/80'} text-white transition-all duration-300 z-10 ${!micActive && aiHasFinishedSpeaking && !isSpeaking ? 'animate-pulse ring-4 ring-[#01CDFE]/50' : ''}`}
                        onClick={() => {
                          console.log('Mic button clicked');
                          toggleMicrophone();
                        }}
                        disabled={isSpeaking || !isCallActive}
                        title={micActive ? "Click to stop recording and submit" : "Click to start speaking"}
                        type="button"
                      >
                        {micActive ? (
                          <>
                            <Mic className="h-5 w-5" />
                            {isListening && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                              </span>
                            )}
                          </>
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Submit button - only shown when there's content to submit */}
                    {liveTranscript && (
                      <div className="flex w-full gap-2 mt-2">
                        <button
                          className={`px-6 py-2 rounded-full font-medium flex-1 ${isSpeaking ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] hover:opacity-90'} text-white transition-all duration-300 flex items-center justify-center gap-2`}
                          onClick={handleSubmitResponse}
                          disabled={isSpeaking || !isCallActive}
                        >
                          <Send className="h-4 w-4" />
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-[#8BA3C7] text-sm">
                    Call not active
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Start Interview Button - only shown when call is not active */}
        {!isCallActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A101F]/70 backdrop-blur-sm z-10 p-4 overflow-y-auto">
            <div className="text-center mb-6 max-w-md">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] bg-clip-text text-transparent">
                Interview
              </h1>
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
                    <h2 className="ml-3 text-lg font-bold text-white mb-4">Interview Guidelines</h2>
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
            
            {/* Name Input Modal */}
            {showNameInput && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-[#1A2138] p-6 rounded-xl border border-[#2A3A64] shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-bold text-white mb-4">What's your name?</h3>
                  <p className="text-[#8BA3C7] mb-4">The AI interviewer will use your name during the introduction.</p>
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Enter your name"
                    className="w-full p-3 bg-[#0E1428] border border-[#2A3A64] rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-[#01CDFE]"
                    onKeyDown={handleNameKeyDown}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setShowNameInput(false);
                        handleStartCall();
                      }}
                      className="bg-[#0E1428] text-[#8BA3C7] hover:text-white mr-2"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleStartCall}
                      className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!showNameInput && (
              <Button
                onClick={handleStartCall}
                className="bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] text-white font-medium py-3 px-8 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg text-lg"
              >
                <Phone className="h-5 w-5" />
                <span>Start Interview</span>
              </Button>
            )}
          </div>
        )}
        
        {/* Error Message */}
        {/* {error && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#FF3864]/10 border border-[#FF3864]/30 rounded-lg z-50">
            <p className="text-[#FF3864] text-center">{error}</p>
          </div>
        )} */}
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
