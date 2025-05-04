export interface InterviewQuestion {
  id: number;
  question: string;
  type: string;
}

// Sample interview questions by type
export const sampleQuestions: Record<string, InterviewQuestion[]> = {
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
export const fallbackResponses = [
  "Thank you for sharing your perspective. Let's move on to the next question.",
  "I appreciate your detailed answer. Let's continue with the next topic.",
  "That's an interesting approach. Now, let's discuss something else.",
  "Thanks for explaining that. Let's move forward to the next question.",
  "I understand your point of view. Let's proceed to the next area I'd like to explore."
];

// Get random interviewer response
export const getRandomResponse = (isLastQuestion: boolean): string => {
  if (isLastQuestion) {
    return "Thank you for all your responses. That concludes our interview today. We appreciate your time and insights.";
  }
  
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

// Format time as MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
