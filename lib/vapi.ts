"use client";

import Vapi from '@vapi-ai/web';

// Define the interview data structure
export interface InterviewData {
  interviewType: string;
  experienceLevel: string;
  technicalStack: string[];
  additionalInfo?: string;
}

// Initialize the interview data with default values
export const defaultInterviewData: InterviewData = {
  interviewType: 'Frontend Developer',
  experienceLevel: 'Intermediate',
  technicalStack: ['JavaScript', 'React'],
  additionalInfo: '',
};

// Define the interview types
export const interviewTypes = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Mobile Developer',
  'Security Engineer',
  'Cloud Architect'
];

// Define the experience levels
export const experienceLevels = [
  'Beginner',     // 0-1 years
  'Intermediate', // 2-3 years
  'Advanced'      // 3-5 years
];

// Define common technical stacks
export const technicalStacks = {
  frontend: ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Next.js', 'HTML', 'CSS', 'Tailwind'],
  backend: ['Node.js', 'Python', 'Java', 'C#', 'Go', 'PHP', 'Ruby', 'Express', 'Django', 'Spring'],
  database: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'DynamoDB'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Terraform'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
  data: ['Python', 'R', 'SQL', 'Pandas', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Tableau', 'Power BI'],
  security: ['Network Security', 'Penetration Testing', 'Encryption', 'Authentication', 'Authorization'],
  cloud: ['AWS', 'Azure', 'GCP', 'Serverless', 'Microservices', 'Containers', 'IaC']
};

/**
 * Creates a Vapi assistant for gathering interview information
 * 
 * @param onDataGathered Callback function that receives the gathered interview data
 * @returns An object with methods to control the assistant
 */
export const createVapiAssistant = (onDataGathered: (data: InterviewData) => void) => {
  // Initialize Vapi
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || '');
  
  // Set up event listeners for the Vapi client
  vapi.on('call-end', () => {
    console.log('Call has ended, processing data');
    
    //Use the data we've collected during the conversation
    const interviewData = collectInterviewData();
    onDataGathered(interviewData);
  });

  vapi.on('error', (error) => {
    console.error('Vapi assistant error:', error);
  });

  // Store messages received during the conversation
  let conversationMessages: any[] = [];

  // Listen for messages during the conversation
  vapi.on('message', (message) => {
    console.log('Message received:', message);
    conversationMessages.push(message);
  });

  // Function to collect interview data from conversation messages
  const collectInterviewData = (): InterviewData => {
    const interviewData: InterviewData = {...defaultInterviewData};
    
    // Process all messages to extract interview data
    conversationMessages.forEach((message) => {
      // Only process user messages or transcripts
      if (message.role === 'user' || message.type === 'transcript') {
        const content = (message.content || message.transcript || '').toLowerCase();
        
        // Extract interview type
        interviewTypes.forEach(type => {
          if (content.includes(type.toLowerCase())) {
            interviewData.interviewType = type;
          }
        });
        
        // Extract experience level
        experienceLevels.forEach(level => {
          if (content.includes(level.toLowerCase())) {
            interviewData.experienceLevel = level;
          }
        });
        
        // Extract technical stack
        const foundTech: string[] = [];
        Object.values(technicalStacks).flat().forEach(tech => {
          if (content.includes(tech.toLowerCase())) {
            foundTech.push(tech);
          }
        });
        
        if (foundTech.length > 0) {
          interviewData.technicalStack = foundTech;
        }
        
        // Extract additional information
        if (content.includes('additional information') || 
            content.includes('other details') || 
            content.includes('specific requirements')) {
          const parts = content.split(/information|details|requirements/i);
          if (parts.length > 1) {
            interviewData.additionalInfo = parts[1].trim();
          }
        }
      }
    });
    
    return interviewData;
  };

  // Create an object with methods to control the assistant
  return {
    // Start the assistant with inline configuration
    start: async () => {
      try {
        // Reset conversation messages when starting a new call
        conversationMessages = [];
        
        // Start with inline configuration - this is the most reliable approach
        await vapi.start({
          model: {
            provider: 'openai',
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an interview preparation assistant. Your goal is to gather information about the user's upcoming interview. Ask about:
                1. The type of tech role they're interviewing for (${interviewTypes.join(', ')})
                2. Their experience level (${experienceLevels.join(', ')})
                3. Their technical stack and skills
                4. Any specific areas they want to focus on
                
                Be conversational and helpful. After gathering all the necessary information, let them know you'll generate personalized interview questions for them.`
              }
            ],
          },
          voice: {
            provider: 'openai',
            voiceId: 'alloy',
          },
          transcriber: {
            provider: 'deepgram',
            language: 'en-US',
          },
        });
        console.log('Vapi assistant started');
      } catch (error) {
        console.error('Error starting Vapi assistant:', error);
      }
    },
    
    // Stop the assistant
    stop: () => {
      vapi.stop();
      console.log('Vapi assistant stopped');
    },
    
    // Send a text message to the assistant
    send: (message: string) => {
      vapi.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message,
        },
      });
    },
    
    // Mute/unmute the microphone
    setMuted: (muted: boolean) => {
      vapi.setMuted(muted);
    },
    
    // Check if the microphone is muted
    isMuted: () => {
      return vapi.isMuted();
    },
    
    // Say something and optionally end the call after speaking
    say: (message: string, endCallAfterSpoken: boolean = false) => {
      vapi.say(message, endCallAfterSpoken);
    },
    
    // Get the current conversation data 
    getCurrentData: () => {
      return collectInterviewData();
    }
  };
};
