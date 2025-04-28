"use client";

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, User, Bot, Loader2 } from 'lucide-react';


// Add custom animation keyframes
const CustomAnimations = () => {
  return (
    <style jsx global>{`
      @keyframes equalizer {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
      
      @keyframes glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .tech-ring {
        animation: rotate 30s linear infinite;
      }
      
      .float {
        animation: float 6s ease-in-out infinite;
      }
      
      .glow {
        animation: glow 3s ease-in-out infinite;
      }
    `}</style>
  );
};

interface AgentProps {
  userName?: string;
  userId?: string;
  type?: 'generate' | 'analyze';
}

const Agent = ({ userName = 'User', userId = 'user1', type = 'generate' }: AgentProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [interviewMessage, setInterviewMessage] = useState("Ready to start your interview practice. Press the call button to begin.");
  
  // Audio context and analyzer for user microphone
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const micStreamRef = React.useRef<MediaStream | null>(null);
  
  // Initialize audio context and analyzer for user microphone
  useEffect(() => {
    if (isCallActive && !isMuted) {
      const initMicrophone = async () => {
        try {
          // Create audio context
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
          
          // Get user microphone
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;
          
          // Create analyzer
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          
          // Connect microphone to analyzer
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          
          // Start monitoring audio levels
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkAudioLevel = () => {
            if (!analyserRef.current) return;
            
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate average volume level
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            
            // Set user speaking state based on volume threshold
            const threshold = 15; // Adjust this threshold as needed
            setIsUserSpeaking(average > threshold);
            setUserAudioLevel(average);
            
            // Continue monitoring
            requestAnimationFrame(checkAudioLevel);
          };
          
          checkAudioLevel();
        } catch (error) {
          console.error('Error accessing microphone:', error);
        }
      };
      
      initMicrophone();
      
      return () => {
        // Clean up
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };
    }
  }, [isCallActive, isMuted]);
  
  // Simulate AI speaking
  useEffect(() => {
    if (isCallActive) {
      let speakingTimer: NodeJS.Timeout;
      
      if (isAISpeaking) {
        // When AI starts speaking, update the message
        setInterviewMessage("I'm listening to your responses. Speak clearly and take your time.");
        
        // Simulate AI speaking for a random duration
        const speakDuration = 3000 + Math.random() * 2000; // 3-5 seconds
        
        speakingTimer = setTimeout(() => {
          setIsAISpeaking(false);
        }, speakDuration);
      } else {
        // When AI stops speaking, wait before speaking again
        speakingTimer = setTimeout(() => {
          setIsAISpeaking(true);
        }, 4000 + Math.random() * 3000); // Wait 4-7 seconds between speaking
      }
      
      return () => clearTimeout(speakingTimer);
    } else {
      setIsAISpeaking(false);
    }
  }, [isCallActive, isAISpeaking]);
  
  // Simulate audio level animation for AI
  useEffect(() => {
    if (isCallActive && isAISpeaking) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isCallActive, isAISpeaking]);

  // Handle call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  const handleCallToggle = () => {
    if (!isCallActive) {
      setIsConnecting(true);
      // Simulate connection delay
      setTimeout(() => {
        setIsConnecting(false);
        setIsCallActive(true);
        // Set initial message
        setInterviewMessage("Hello! I'll be conducting your interview today. Let's get started with some questions.");
        // Start AI speaking
        setIsAISpeaking(true);
      }, 2000);
    } else {
      setIsCallActive(false);
      setCallDuration(0);
      setInterviewMessage("Ready to start your interview practice. Press the call button to begin.");
    }
  };

  return (
    <>
      <CustomAnimations />
      <div className="flex flex-col h-[600px] bg-[#0E1428] border border-[#1A2138] rounded-xl overflow-hidden shadow-lg relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4D4DFF]/5 via-transparent to-[#9C42F5]/5"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#01CDFE]/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#9C42F5]/10 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#00F6C5]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>
      {/* Call header */}
      <div className="relative flex items-center justify-center p-6 bg-[#050A18] border-b border-[#1A2138]">
        <div className="absolute left-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isCallActive ? 'bg-[#00F6C5] animate-pulse' : 'bg-[#FF3864]'}`}></div>
            <span className="text-sm text-[#8BA3C7]">
              {isConnecting ? 'Connecting...' : isCallActive ? 'In call' : 'Ready to connect'}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-[#E2F0FF] font-medium text-xl">Interview {type === 'generate' ? 'Session' : 'Analysis'}</h3>
          {isCallActive && (
            <p className="text-sm text-[#01CDFE]">{formatTime(callDuration)}</p>
          )}
        </div>
      </div>
      
      {/* Call content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#050A18] to-[#0E1428]">
        <div className="relative">
          {/* Agent avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1A2138] to-[#0E1428] border-4 border-[#4D4DFF] flex items-center justify-center mb-6 relative overflow-hidden shadow-[0_0_15px_rgba(77,77,255,0.3)]">
            {/* Simple clean background without patterns */}
            <div className="absolute inset-0 bg-[#0E1428]"></div>
            
            {/* Simple glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#4D4DFF]/10 animate-pulse" style={{ animationDuration: '3s' }}></div>
            </div>
            
            <Bot size={60} className="text-[#01CDFE] relative z-10 drop-shadow-[0_0_8px_rgba(1,205,254,0.5)]" />
            
            {/* Audio visualization rings - only shown when AI is speaking */}
            {isCallActive && !isMuted && isAISpeaking && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Multiple audio rings with different sizes and animations */}
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`absolute rounded-full border-2 ${i % 2 === 0 ? 'border-[#01CDFE]' : 'border-[#9C42F5]'} opacity-0`}
                    style={{
                      width: `${80 + audioLevel * (0.6 + i * 0.15)}px`,
                      height: `${80 + audioLevel * (0.6 + i * 0.15)}px`,
                      animation: `ping ${1 + i * 0.3}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  ></div>
                ))}
                
                {/* Equalizer bars */}
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => {
                      const height = 10 + Math.random() * 30;
                      return (
                        <div 
                          key={i}
                          className="w-1 bg-[#00F6C5] rounded-full"
                          style={{
                            height: `${height}px`,
                            animation: 'equalizer 1s ease-in-out infinite',
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* User avatar - smaller and positioned below */}
          <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#1A2138] to-[#0E1428] border-2 border-[#9C42F5] flex items-center justify-center shadow-[0_0_10px_rgba(156,66,245,0.3)] overflow-hidden">
            {/* Simple clean background without patterns or lines */}
            <div className="absolute inset-0 bg-[#0E1428]"></div>
            <User size={24} className="text-[#E2F0FF] relative z-10 glow" />
            {/* Only show user audio visualization when user is actually speaking */}
            {isCallActive && !isMuted && isUserSpeaking && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#00F6C5]/30 flex justify-center items-end overflow-hidden">
                <div className="flex space-x-px h-full items-end">
                  {[...Array(5)].map((_, i) => {
                    // Use actual user audio level to determine height
                    const height = 30 + (userAudioLevel * 2);
                    return (
                      <div 
                        key={i}
                        className="w-px bg-[#00F6C5]"
                        style={{
                          height: `${height}%`,
                          animation: 'equalizer 0.8s ease-in-out infinite',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <h2 className="text-[#E2F0FF] text-xl font-medium mb-1">AI Interview Assistant</h2>
        <p className="text-[#8BA3C7] text-center max-w-md mb-3 text-sm">
          {isConnecting ? (
            <span className="flex items-center justify-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Establishing secure connection...
            </span>
          ) : isCallActive ? (
            <span className={isAISpeaking ? "text-[#01CDFE]" : ""}>
              {interviewMessage}
            </span>
          ) : (
            "Ready to start your interview practice. Press the call button to begin."
          )}
        </p>
        
        {/* Call status indicators */}
        {isCallActive && (
          <div className="flex items-center space-x-4 mt-3 mb-2 flex-wrap justify-center">
            <div className="flex flex-col items-center mx-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMuted ? 'bg-[#FF3864]' : 'bg-[#1A2138]'}`}>
                {isMuted ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-[#00F6C5]" />}
              </div>
              <span className="text-xs text-[#8BA3C7] mt-1">{isMuted ? 'Muted' : 'Mic on'}</span>
            </div>
            
            <div className="flex flex-col items-center mx-1">
              <div className="w-10 h-10 rounded-full bg-[#1A2138] flex items-center justify-center">
                <Volume2 size={18} className="text-[#01CDFE]" />
              </div>
              <span className="text-xs text-[#8BA3C7] mt-1">Speaker</span>
            </div>
            
            <div className="flex flex-col items-center mx-1">
              <div className="w-10 h-10 rounded-full bg-[#1A2138] flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00F6C5] animate-pulse"></div>
                  <Loader2 size={18} className="text-[#01CDFE] animate-spin" />
                </div>
              </div>
              <span className="text-xs text-[#8BA3C7] mt-1">Processing</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className="p-6 border-t border-[#1A2138] bg-[#050A18] flex justify-center">
        <div className="flex items-center space-x-6">
          {isCallActive && (
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-[#FF3864]' : 'bg-[#1A2138] hover:bg-[#2A3148]'}`}
            >
              {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-[#E2F0FF]" />}
            </button>
          )}
          
          <button 
            onClick={handleCallToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${isCallActive ? 'bg-[#FF3864]' : 'bg-[#00F6C5]'}`}
          >
            {isConnecting ? (
              <Loader2 size={28} className="text-white animate-spin" />
            ) : isCallActive ? (
              <PhoneOff size={28} className="text-white" />
            ) : (
              <Phone size={28} className="text-white" />
            )}
          </button>
          
          {isCallActive && (
            <button 
              className="w-14 h-14 rounded-full bg-[#1A2138] flex items-center justify-center hover:bg-[#2A3148] transition-colors"
            >
              <Volume2 size={24} className="text-[#E2F0FF]" />
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Agent;