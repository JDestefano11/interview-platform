// Gemini API utility for professional interview questions & feedback
// Uses environment variable NEXT_PUBLIC_GEMINI_API_KEY

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_GEMINI_API_KEY);
// Use Gemini Flash model endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

async function geminiRequest(messages: any[]): Promise<string> {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not found');

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256
      }
    })
  });
  if (!res.ok) {
    let errMsg = `Gemini API error: ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      errMsg += ` | ${JSON.stringify(errData)}`;
    } catch {}
    throw new Error(errMsg);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Generate a professional introduction for the interview
export async function generateGeminiIntroduction(interviewInfo: {role: string, experienceLevel: string, username?: string}): Promise<string> {
  const { role, experienceLevel, username } = interviewInfo;
  
  // Create a personalized greeting with the username if provided
  let greeting = username ? `Hello ${username}! ` : "Hello! ";
  
  // Create a short introduction (1-2 sentences) that includes the role and experience level
  let prompt = `You are a professional interviewer for a ${role} position. The candidate has ${experienceLevel} experience. `;
  prompt += `Please generate a very brief introduction (1-2 sentences only). `;
  prompt += `Start with "${greeting}" and introduce yourself as an AI interviewer for the ${role} position. `;
  prompt += `Keep it professional but friendly. `;
  prompt += `At the end, add the phrase 'Let\'s begin with our first question.' to create a smooth transition.`;
  
  const messages = [{ role: 'user', parts: [{ text: prompt }] }];
  return geminiRequest(messages);
}

// Generate a professional interview question
export async function generateGeminiQuestion(interviewInfo: {role: string, technologies: string[], experienceLevel: string, previousQuestions: string[]}): Promise<string> {
  const { role, technologies, experienceLevel, previousQuestions } = interviewInfo;
  
  // Create a more specific prompt that focuses on the selected technologies
  let prompt = `You are a professional interviewer for a ${role} position. The candidate has ${experienceLevel} experience.`;
  
  // Only include technologies if they were selected
  if (technologies && technologies.length > 0) {
    prompt += ` Focus ONLY on these specific technologies that the candidate selected: ${technologies.join(', ')}.`;
  }
  
  prompt += ` Please generate a single, clear, professional interview question that is directly relevant to these technologies and the ${role} position.`;
  
  // Avoid repeating questions
  if (previousQuestions && previousQuestions.length > 0) {
    prompt += ` Avoid repeating these previous questions: ${previousQuestions.join(' | ')}.`;
  }
  
  prompt += ` Only return the question, no intro or explanation.`;
  
  const messages = [{ role: 'user', parts: [{ text: prompt }] }];
  return geminiRequest(messages);
}

// Generate professional feedback for a candidate's answer
export async function generateGeminiFeedback(interviewInfo: {role: string, technologies: string[], experienceLevel: string}, question: string, answer: string): Promise<string> {
  const { role, technologies, experienceLevel } = interviewInfo;
  
  // Create a more specific prompt that focuses on the selected technologies
  let prompt = `You are a professional interviewer for a ${role} position. The candidate has ${experienceLevel} experience.`;
  
  // Only include technologies if they were selected
  if (technologies && technologies.length > 0) {
    prompt += ` The candidate selected these specific technologies: ${technologies.join(', ')}.`;
  }
  
  prompt += ` You asked the following question: "${question}". The candidate answered: "${answer}".`;
  prompt += ` Please provide concise, professional feedback as an interviewer would, focusing on correctness, completeness, and professionalism.`;
  prompt += ` Evaluate the answer specifically in relation to the ${role} position and the selected technologies.`;
  prompt += ` Do not repeat the question or answer, just provide the feedback.`;
  
  const messages = [{ role: 'user', parts: [{ text: prompt }] }];
  return geminiRequest(messages);
}
