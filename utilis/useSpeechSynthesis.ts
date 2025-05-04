import { useState, useRef } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiHasFinishedSpeaking, setAiHasFinishedSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis and select voice
  const init = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      synthRef.current.cancel();
      const voices = synthRef.current.getVoices();
      let voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
      if (voice) setSelectedVoice(voice);
    }
  };

  // Speak text using selected voice
  const speakText = (text: string) => {
    if (!synthRef.current || !text) {
      setAiHasFinishedSpeaking(true);
      return;
    }
    synthRef.current.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setAiHasFinishedSpeaking(true);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setAiHasFinishedSpeaking(true);
      };
      setIsSpeaking(true);
      synthRef.current!.speak(utterance);
    }, 250);
  };

  // Cancel any ongoing speech
  const cancel = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    setAiHasFinishedSpeaking(true);
  };

  return {
    synthRef,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    setIsSpeaking,
    aiHasFinishedSpeaking,
    setAiHasFinishedSpeaking,
    speakText,
    cancel,
    init,
  };
}
