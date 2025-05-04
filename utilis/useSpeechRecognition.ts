// Extend window interface for TS
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useRef, useState } from "react";

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string, isFinal: boolean) => void;
  lang?: string;
}

export function useSpeechRecognition({ onResult, lang = 'en-US' }: UseSpeechRecognitionProps = {}) {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  // Initialize recognition instance
  const init = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = lang;
    recognitionRef.current.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      if (onResult) {
        if (final) onResult(final, true);
        if (interim) onResult(interim, false);
      }
      setLiveTranscript(final + interim);
    };
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);
  };

  const startRecognition = () => {
    if (!recognitionRef.current) init();
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return {
    recognitionRef,
    isListening,
    liveTranscript,
    startRecognition,
    stopRecognition,
    init,
    setLiveTranscript,
  };
}
