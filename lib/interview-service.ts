"use client";

import { createVapiAssistant, InterviewData, defaultInterviewData } from './vapi';
import { generateInterviewQuestions, InterviewQuestion, generateFollowUpQuestion, evaluateResponse } from './gemini';

// Interview service class to manage the interview process
export class InterviewService {
  private interviewData: InterviewData = defaultInterviewData;
  private questions: InterviewQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private responses: Record<string, string> = {};
  private evaluations: Record<string, any> = {};
  
  // Event callbacks
  private onDataGatheredCallback: ((data: InterviewData) => void) | null = null;
  private onQuestionsGeneratedCallback: ((questions: InterviewQuestion[]) => void) | null = null;
  private onFollowUpGeneratedCallback: ((followUp: string) => void) | null = null;
  private onEvaluationCompleteCallback: ((evaluation: any) => void) | null = null;
  
  constructor() {
    // Initialize with default values
  }
  
  // Start the Vapi assistant to gather interview data
  public startVapiAssistant(): void {
    const assistant = createVapiAssistant((data: InterviewData) => {
      this.interviewData = data;
      
      // Call the callback if it exists
      if (this.onDataGatheredCallback) {
        this.onDataGatheredCallback(data);
      }
      
      // Automatically generate questions after data is gathered
      this.generateQuestions();
    });
    
    // Start the call
    assistant.start();
  }
  
  // Generate interview questions using Gemini
  public async generateQuestions(numberOfQuestions: number = 5): Promise<void> {
    try {
      this.questions = await generateInterviewQuestions(this.interviewData, numberOfQuestions);
      this.currentQuestionIndex = 0;
      
      // Call the callback if it exists
      if (this.onQuestionsGeneratedCallback) {
        this.onQuestionsGeneratedCallback(this.questions);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    }
  }
  
  // Get the current question
  public getCurrentQuestion(): InterviewQuestion | null {
    if (this.questions.length === 0 || this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    
    return this.questions[this.currentQuestionIndex];
  }
  
  // Move to the next question
  public nextQuestion(): InterviewQuestion | null {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return this.getCurrentQuestion();
    }
    
    return null;
  }
  
  // Move to the previous question
  public previousQuestion(): InterviewQuestion | null {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return this.getCurrentQuestion();
    }
    
    return null;
  }
  
  // Save a response to a question
  public saveResponse(questionId: string, response: string): void {
    this.responses[questionId] = response;
  }
  
  // Get a saved response
  public getResponse(questionId: string): string {
    return this.responses[questionId] || '';
  }
  
  // Generate a follow-up question based on a response
  public async generateFollowUp(questionId: string): Promise<string> {
    const question = this.questions.find(q => q.id === questionId);
    const response = this.responses[questionId];
    
    if (!question || !response) {
      return '';
    }
    
    try {
      const followUp = await generateFollowUpQuestion(
        question.question,
        response,
        this.interviewData
      );
      
      // Call the callback if it exists
      if (this.onFollowUpGeneratedCallback) {
        this.onFollowUpGeneratedCallback(followUp);
      }
      
      return followUp;
    } catch (error) {
      console.error("Error generating follow-up:", error);
      return '';
    }
  }
  
  // Evaluate a response
  public async evaluateResponse(questionId: string): Promise<any> {
    const question = this.questions.find(q => q.id === questionId);
    const response = this.responses[questionId];
    
    if (!question || !response) {
      return null;
    }
    
    try {
      const evaluation = await evaluateResponse(
        question.question,
        response,
        this.interviewData
      );
      
      // Save the evaluation
      this.evaluations[questionId] = evaluation;
      
      // Call the callback if it exists
      if (this.onEvaluationCompleteCallback) {
        this.onEvaluationCompleteCallback(evaluation);
      }
      
      return evaluation;
    } catch (error) {
      console.error("Error evaluating response:", error);
      return null;
    }
  }
  
  // Get all questions
  public getAllQuestions(): InterviewQuestion[] {
    return this.questions;
  }
  
  // Get all responses
  public getAllResponses(): Record<string, string> {
    return this.responses;
  }
  
  // Get all evaluations
  public getAllEvaluations(): Record<string, any> {
    return this.evaluations;
  }
  
  // Get the interview data
  public getInterviewData(): InterviewData {
    return this.interviewData;
  }
  
  // Set the interview data manually
  public setInterviewData(data: InterviewData): void {
    this.interviewData = data;
  }
  
  // Event listeners
  public onDataGathered(callback: (data: InterviewData) => void): void {
    this.onDataGatheredCallback = callback;
  }
  
  public onQuestionsGenerated(callback: (questions: InterviewQuestion[]) => void): void {
    this.onQuestionsGeneratedCallback = callback;
  }
  
  public onFollowUpGenerated(callback: (followUp: string) => void): void {
    this.onFollowUpGeneratedCallback = callback;
  }
  
  public onEvaluationComplete(callback: (evaluation: any) => void): void {
    this.onEvaluationCompleteCallback = callback;
  }
}

// Create a singleton instance of the interview service
export const interviewService = new InterviewService();

// Export the singleton instance as default
export default interviewService;
