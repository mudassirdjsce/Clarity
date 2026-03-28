import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function VoiceInputButton({ onTranscript, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [onTranscript]);

  const toggleRecording = () => {
    if (disabled || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (!isSupported) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={toggleRecording}
      disabled={disabled}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
      className={cn(
        'p-2 rounded-xl transition-all duration-200 shrink-0 relative',
        isRecording
          ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-transparent'
      )}
    >
      {isRecording && (
        <span className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping pointer-events-none" />
      )}
      {isRecording
        ? <MicOff className="w-4 h-4 relative z-10" />
        : <Mic className="w-4 h-4" />
      }
    </motion.button>
  );
}
