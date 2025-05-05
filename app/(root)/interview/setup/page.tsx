"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


// Define the interview types and their associated technologies
const interviewTypes = [
  {
    id: "frontend",
    name: "Front End Developer",
    technologies: ["React", "Angular", "Vue", "JavaScript", "TypeScript", "HTML/CSS", "Next.js", "Tailwind CSS"]
  },
  {
    id: "backend",
    name: "Backend Developer",
    technologies: ["Node.js", "Python", "Java", "C#", "Go", "PHP", "Ruby", "SQL", "NoSQL", "REST API", "GraphQL"]
  },
  {
    id: "fullstack",
    name: "Full Stack Developer",
    technologies: ["React", "Angular", "Vue", "JavaScript", "TypeScript", "Node.js", "Python", "Java", "SQL", "NoSQL", "REST API"]
  },
  {
    id: "cloud",
    name: "Cloud Engineer",
    technologies: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "CloudFormation", "Serverless"]
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    technologies: ["CI/CD", "Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Ansible", "Terraform", "Monitoring"]
  },
  {
    id: "security",
    name: "Security Engineer",
    technologies: ["Network Security", "Application Security", "Penetration Testing", "Cryptography", "Security Auditing", "Compliance"]
  },
  {
    id: "ml",
    name: "Machine Learning Engineer",
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Data Processing", "Computer Vision", "NLP", "MLOps"]
  },
  {
    id: "other",
    name: "Other (Non-Coding Role)",
    technologies: []
  }
];

// Experience levels
const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

// Question count options
const questionCounts = [
  { value: 3, label: "3 Questions (Quick)" },
  { value: 5, label: "5 Questions (Standard)" },
  { value: 10, label: "10 Questions (Comprehensive)" }
];

export default function InterviewSetupPage() {
  const router = useRouter();
  
  // Form state
  const [experienceLevel, setExperienceLevel] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update available technologies when interview type changes
  useEffect(() => {
    const selectedTypeObj = interviewTypes.find(type => type.id === selectedType);
    if (selectedTypeObj) {
      setAvailableTechnologies(selectedTypeObj.technologies);
      // Reset selected technologies when type changes
      setSelectedTechnologies([]);
    }
  }, [selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!experienceLevel) {
      setError("Please select an experience level");
      return;
    }
    if (!selectedType) {
      setError("Please select an interview type");
      return;
    }
    if (selectedType === "other" && !customType) {
      setError("Please enter a custom role name");
      return;
    }
    if (selectedType !== "other" && selectedTechnologies.length === 0) {
      setError("Please select at least one technology");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    // Get the proper role name from the selected type
    const roleName = selectedType === "other" ? customType : interviewTypes.find(t => t.id === selectedType)?.name || "";
    
    // Create the interview configuration
    const interviewDetails = {
      role: roleName,
      experienceLevel: experienceLevel,
      technologies: selectedTechnologies,
      questionCount: questionCount
    };
    
    // Save interview details to localStorage for the call page to use
    localStorage.setItem("interviewDetails", JSON.stringify(interviewDetails));
    
    try {
      // Redirect to the call page with parameters
      const queryParams = new URLSearchParams({
        role: roleName,
        level: experienceLevel,
        technologies: selectedTechnologies.join(','),
        count: questionCount.toString()
      }).toString();
      
      router.push(`/interview/call?${queryParams}`);
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("There was an error starting your interview. Please try again.");
      setIsLoading(false);
    }
  };

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(prev => prev.filter(t => t !== tech));
    } else {
      setSelectedTechnologies(prev => [...prev, tech]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050A18] bg-gradient-to-b from-[#050A18] to-[#0A1228]">
      {/* Enhanced Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0E1428]/95 via-[#1A2138]/95 to-[#0E1428]/95 backdrop-blur-md border-b border-[#2A3A64]/30 shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex items-center w-1/3">
            <Button 
              variant="ghost" 
              className="text-[#8BA3C7] hover:text-white hover:bg-[#1A2138]/50 transition-all duration-200 group"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center w-1/3">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] to-[#9C42F5] font-bold text-xl">Interview Setup</div>
          </div>
          
          <div className="w-1/3"></div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Intro Cards - Steps Overview */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 Card */}
          <div className="bg-[#0E1428]/90 backdrop-blur-md rounded-xl border border-[#1A2138] shadow-lg overflow-hidden group hover:border-[#01CDFE]/50 transition-all duration-300">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01CDFE]/10 to-transparent rounded-bl-full"></div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-3 group-hover:border-[#01CDFE] transition-all duration-300">
                  <span className="text-[#01CDFE] font-bold">1</span>
                </div>
                <h3 className="font-bold text-white">Choose Experience</h3>
              </div>
              <p className="text-[#8BA3C7] text-sm pl-[52px]">Select your experience level to get questions tailored to your career stage.</p>
            </div>
          </div>
          
          {/* Step 2 Card */}
          <div className="bg-[#0E1428]/90 backdrop-blur-md rounded-xl border border-[#1A2138] shadow-lg overflow-hidden group hover:border-[#4D4DFF]/50 transition-all duration-300">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4D4DFF]/10 to-transparent rounded-bl-full"></div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-3 group-hover:border-[#4D4DFF] transition-all duration-300">
                  <span className="text-[#4D4DFF] font-bold">2</span>
                </div>
                <h3 className="font-bold text-white">Set Question Count</h3>
              </div>
              <p className="text-[#8BA3C7] text-sm pl-[52px]">Decide how many questions you want to practice with during your session.</p>
            </div>
          </div>
          
          {/* Step 3 Card */}
          <div className="bg-[#0E1428]/90 backdrop-blur-md rounded-xl border border-[#1A2138] shadow-lg overflow-hidden group hover:border-[#9C42F5]/50 transition-all duration-300">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#9C42F5]/10 to-transparent rounded-bl-full"></div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-3 group-hover:border-[#9C42F5] transition-all duration-300">
                  <span className="text-[#9C42F5] font-bold">3</span>
                </div>
                <h3 className="font-bold text-white">Select Role</h3>
              </div>
              <p className="text-[#8BA3C7] text-sm pl-[52px]">Choose the specific role you're interviewing for to get relevant technical questions.</p>
            </div>
          </div>
        </div>
        
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] via-[#4D4DFF] to-[#9C42F5]">
            Design Your Perfect Interview
          </h1>
          <p className="text-[#8BA3C7] max-w-2xl mx-auto mt-2">
            Customize your AI interview experience to match your career goals and practice needs.
          </p>
        </div>
        
        <div className="bg-[#0E1428]/80 backdrop-blur-md rounded-xl border border-[#1A2138] shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] via-[#4D4DFF] to-[#9C42F5] mb-6">
            Customize Your Interview Experience
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-[#1A2138]/80 border border-[#FF3864] rounded-lg text-[#FF3864]">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Experience Level */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01CDFE] to-[#4D4DFF] mb-4 flex items-center">
                <span className="inline-flex w-8 h-8 rounded-full bg-gradient-to-r from-[#01CDFE] to-[#4D4DFF] mr-3 text-sm text-white font-bold items-center justify-center shadow-[0_0_10px_rgba(1,205,254,0.4)]">1</span>
                Select Your Experience Level
              </h2>
              <p className="text-[#8BA3C7] mb-4 ml-11">Choose the experience level that best matches your career stage to get appropriately challenging questions.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {experienceLevels.map((level) => {
                  // Define level-specific descriptions and icons
                  let description = "";
                  let icon = null;
                  
                  if (level === "Beginner") {
                    description = "0-2 years of experience, foundational knowledge";
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#01CDFE]">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    );
                  } else if (level === "Intermediate") {
                    description = "2-5 years of experience, practical knowledge";
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D4DFF]">
                        <path d="M18 20V10"></path>
                        <path d="M12 20V4"></path>
                        <path d="M6 20v-6"></path>
                      </svg>
                    );
                  } else if (level === "Advanced") {
                    description = "5+ years of experience, advanced knowledge";
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9C42F5]">
                        <path d="M2 20h.01"></path>
                        <path d="M7 20v-4"></path>
                        <path d="M12 20v-8"></path>
                        <path d="M17 20v-12"></path>
                        <path d="M22 20v-16"></path>
                      </svg>
                    );
                  }
                  
                  return (
                    <div
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`p-5 rounded-lg cursor-pointer transition-all duration-200 border ${
                        experienceLevel === level 
                          ? 'bg-[#1A2138] border-[#01CDFE] shadow-[0_0_15px_rgba(1,205,254,0.2)]' 
                          : 'bg-[#0E1428]/80 border-[#1A2138] hover:border-[#01CDFE]/50 hover:bg-[#1A2138]/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#E2F0FF] font-medium">{level}</span>
                            {experienceLevel === level && (
                              <div className="h-3 w-3 rounded-full bg-[#01CDFE] shadow-[0_0_8px_rgba(1,205,254,0.7)] animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-[#8BA3C7] text-sm">{description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Question Count */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4D4DFF] to-[#9C42F5] mb-4 flex items-center">
                <span className="inline-flex w-8 h-8 rounded-full bg-gradient-to-r from-[#4D4DFF] to-[#9C42F5] mr-3 text-sm text-white font-bold items-center justify-center shadow-[0_0_10px_rgba(77,77,255,0.4)]">2</span>
                Number of Questions
              </h2>
              <p className="text-[#8BA3C7] mb-4 ml-11">Choose how many questions you want in your interview session. More questions provide a more comprehensive practice experience.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questionCounts.map((option) => {
                  // Define option-specific descriptions
                  let description = "";
                  let timeEstimate = "";
                  
                  if (option.value === 3) {
                    description = "Quick practice session";
                    timeEstimate = "~10-15 minutes";
                  } else if (option.value === 5) {
                    description = "Standard interview length";
                    timeEstimate = "~15-25 minutes";
                  } else if (option.value === 10) {
                    description = "In-depth interview practice";
                    timeEstimate = "~25-40 minutes";
                  }
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => setQuestionCount(option.value)}
                      className={`p-5 rounded-lg cursor-pointer transition-all duration-200 border ${
                        questionCount === option.value 
                          ? 'bg-[#1A2138] border-[#4D4DFF] shadow-[0_0_15px_rgba(77,77,255,0.2)]' 
                          : 'bg-[#0E1428]/80 border-[#1A2138] hover:border-[#4D4DFF]/50 hover:bg-[#1A2138]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#1A2138] border border-[#2A3A64] flex items-center justify-center mr-3 text-[#4D4DFF] font-bold">
                            {option.value}
                          </div>
                          <span className="text-[#E2F0FF] font-medium">Questions</span>
                        </div>
                        {questionCount === option.value && (
                          <div className="h-3 w-3 rounded-full bg-[#4D4DFF] shadow-[0_0_8px_rgba(77,77,255,0.7)] animate-pulse"></div>
                        )}
                      </div>
                      <div className="ml-11 text-sm">
                        <p className="text-[#8BA3C7]">{description}</p>
                        <p className="text-[#4D4DFF] text-xs mt-1">{timeEstimate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Interview Type */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9C42F5] to-[#01CDFE] mb-4 flex items-center">
                <span className="inline-flex w-8 h-8 rounded-full bg-gradient-to-r from-[#9C42F5] to-[#01CDFE] mr-3 text-sm text-white font-bold items-center justify-center shadow-[0_0_10px_rgba(156,66,245,0.4)]">3</span>
                Select Interview Type
              </h2>
              <p className="text-[#8BA3C7] mb-4 ml-11">Choose the role you're interviewing for to get questions specific to that position.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {interviewTypes.map((type) => {
                  // Define role-specific icons
                  let icon = null;
                  
                  if (type.id === "frontend") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#01CDFE]">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    );
                  } else if (type.id === "backend") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D4DFF]">
                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                        <path d="M6 12h4"></path>
                        <path d="M14 12h4"></path>
                      </svg>
                    );
                  } else if (type.id === "fullstack") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9C42F5]">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    );
                  } else if (type.id === "cloud") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#01CDFE]">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      </svg>
                    );
                  } else if (type.id === "devops") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D4DFF]">
                        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                        <path d="M12 2v2"></path>
                        <path d="M12 22v-2"></path>
                        <path d="m17 20.66-1-1.73"></path>
                        <path d="M11 10.27 7 3.34"></path>
                        <path d="m20.66 17-1.73-1"></path>
                        <path d="m3.34 7 1.73 1"></path>
                      </svg>
                    );
                  } else if (type.id === "security") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9C42F5]">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    );
                  } else if (type.id === "ml") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#01CDFE]">
                        <path d="M12 2v8"></path>
                        <path d="m4.93 10.93 1.41 1.41"></path>
                        <path d="M2 18h2"></path>
                        <path d="M20 18h2"></path>
                        <path d="m19.07 10.93-1.41 1.41"></path>
                        <path d="M22 22H2"></path>
                        <path d="m16 16-4 4-4-4"></path>
                        <path d="M16 6H8a4 4 0 1 0 0 8h8a4 4 0 1 0 0-8Z"></path>
                      </svg>
                    );
                  } else if (type.id === "other") {
                    icon = (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D4DFF]">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    );
                  }
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedType === type.id 
                          ? 'bg-[#1A2138] border-[#9C42F5] shadow-[0_0_15px_rgba(156,66,245,0.2)]' 
                          : 'bg-[#0E1428]/80 border-[#1A2138] hover:border-[#9C42F5]/50 hover:bg-[#1A2138]/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#E2F0FF] font-medium">{type.name}</span>
                            {selectedType === type.id && (
                              <div className="h-3 w-3 rounded-full bg-[#9C42F5] shadow-[0_0_8px_rgba(156,66,245,0.7)] animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-[#8BA3C7] text-xs mt-1">{type.technologies.length} technologies</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Type Input */}
              {selectedType === "other" && (
                <div className="mb-6 ml-11">
                  <label htmlFor="customType" className="block text-[#8BA3C7] mb-2">Enter Custom Role</label>
                  <input
                    type="text"
                    id="customType"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g., Product Manager, UX Designer"
                    className="w-full bg-[#0E1428] border border-[#1A2138] rounded-lg p-3 text-[#E2F0FF] placeholder-[#4A5567] focus:outline-none focus:border-[#9C42F5] transition-all duration-200"
                  />
                </div>
              )}

              {/* Technologies */}
              {selectedType && selectedType !== "other" && (
                <div className="mb-6 ml-11">
                  <label className="block text-[#8BA3C7] mb-2">Select Technologies (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTechnologies.map((tech) => (
                      <div
                        key={tech}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 text-sm ${
                          selectedTechnologies.includes(tech) 
                            ? 'bg-[#9C42F5]/20 border border-[#9C42F5] text-[#E2F0FF]' 
                            : 'bg-[#1A2138]/50 border border-[#1A2138] text-[#8BA3C7] hover:border-[#9C42F5]/50'
                        }`}
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#8BA3C7] mt-2">{selectedTechnologies.length} of {availableTechnologies.length} technologies selected</p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="mt-10">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}
              
              <div className="bg-gradient-to-r from-[#01CDFE]/20 via-[#4D4DFF]/20 to-[#9C42F5]/20 p-0.5 rounded-xl">
                <div className="bg-[#0E1428]/95 rounded-[10px] p-6 flex flex-col items-center">
                  <div className="w-full max-w-md mx-auto text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Start Your Interview?</h3>
                    <p className="text-[#8BA3C7] mb-6">Your AI interviewer will ask questions based on your selections above.</p>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-medium bg-gradient-to-r from-[#01CDFE] via-[#4D4DFF] to-[#9C42F5] hover:opacity-90 transition-all duration-200 rounded-xl shadow-[0_8px_30px_rgba(1,205,254,0.3)]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Interview...
                        </div>
                      ) : (
                        "Start Your Interview"
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center mt-4 text-sm text-[#8BA3C7]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Your data stays private and is not stored on our servers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}