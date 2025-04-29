"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { InterviewData } from "./vapi";

// Initialize Google Generative AI client
export const geminiClient = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || ''
);

// Define the interview question structure
export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedTopics?: string[];
}

// Function to generate interview questions based on gathered data
export const generateInterviewQuestions = async (
  interviewData: InterviewData,
  numberOfQuestions: number = 5
): Promise<InterviewQuestion[]> => {
  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create a prompt based on the interview data
    const prompt = `
      Generate ${numberOfQuestions} interview questions for a ${interviewData.experienceLevel} level ${interviewData.interviewType} position.
      
      Technical stack: ${interviewData.technicalStack.join(', ')}
      ${interviewData.additionalInfo ? `Additional context: ${interviewData.additionalInfo}` : ''}
      
      For each question, provide:
      1. A challenging but appropriate question for the specified experience level
      2. The category of the question (e.g., Technical Knowledge, Problem Solving, System Design)
      3. The difficulty level (easy, medium, or hard)
      4. 2-3 key topics the candidate should address in their answer
      
      Format the response as a JSON array of objects with the following structure:
      [
        {
          "id": "unique-id",
          "question": "the interview question",
          "category": "question category",
          "difficulty": "easy|medium|hard",
          "expectedTopics": ["topic1", "topic2", "topic3"]
        }
      ]
    `;
    
    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the response as JSON
    // Find JSON content within the response (in case there's additional text)
    // Using a regex that doesn't rely on the 's' flag
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }
    
    const jsonContent = jsonMatch[0];
    const questions = JSON.parse(jsonContent) as InterviewQuestion[];
    
    // Ensure each question has a unique ID
    return questions.map((q, index) => ({
      ...q,
      id: q.id || `question-${index + 1}`,
    }));
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [];
  }
};

// Function to generate follow-up questions based on candidate response
export const generateFollowUpQuestion = async (
  originalQuestion: string,
  candidateResponse: string,
  interviewData: InterviewData
): Promise<string> => {
  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      You are an expert technical interviewer for a ${interviewData.interviewType} position.
      
      Original question: "${originalQuestion}"
      
      Candidate's response: "${candidateResponse}"
      
      Based on the candidate's response, generate a thoughtful follow-up question that:
      1. Probes deeper into their knowledge
      2. Challenges any assumptions they've made
      3. Asks them to elaborate on a specific part of their answer
      4. Is appropriate for their experience level (${interviewData.experienceLevel})
      
      Provide only the follow-up question, without any additional explanation.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    return "Could you elaborate more on your previous answer?";
  }
};

// Function to evaluate candidate responses
export const evaluateResponse = async (
  question: string,
  candidateResponse: string,
  interviewData: InterviewData
): Promise<{
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}> => {
  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      You are an expert technical interviewer for a ${interviewData.experienceLevel} level ${interviewData.interviewType} position.
      
      Question: "${question}"
      
      Candidate's response: "${candidateResponse}"
      
      Evaluate the candidate's response and provide:
      1. A score from 1-10
      2. Brief feedback (2-3 sentences)
      3. 2-3 strengths of their answer
      4. 2-3 areas for improvement
      
      Format the response as a JSON object with the following structure:
      {
        "score": number,
        "feedback": "string",
        "strengths": ["string", "string"],
        "improvements": ["string", "string"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the response as JSON
    // Using a regex that doesn't rely on the 's' flag
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }
    
    const jsonContent = jsonMatch[0];
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error evaluating response:", error);
    return {
      score: 5,
      feedback: "Unable to provide detailed feedback at this time.",
      strengths: ["N/A"],
      improvements: ["N/A"]
    };
  }
};
