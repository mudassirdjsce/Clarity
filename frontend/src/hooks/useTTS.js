import { useRef, useState, useCallback, useEffect } from 'react';

const TTS_ENDPOINT = 'http://localhost:5000/api/tts/speak';

// Singleton audio instance so only one plays at a time
let currentAudio = null;
let currentObjectUrl = null;

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  // Also cancel any browser speech still running
  if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
}

/**
 * useTTS – React hook for ElevenLabs text-to-speech with browser fallback.
 *
 * Returns:
 *   speak(text)  – start playback
 *   stop()       – stop playback
 *   isPlaying    – boolean
 *   isLoading    – boolean (while fetching from backend)
 *   error        – string | null
 */
export function useTTS() {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const abortRef                    = useRef(null);

  // Clean up when the component using this hook unmounts
  useEffect(() => () => { stopCurrent(); abortRef.current?.abort(); }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    stopCurrent();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(async (text) => {
    if (!text?.trim()) return;

    // Stop anything currently playing first
    stop();

    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(TTS_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: text.trim() }),
        signal:  controller.signal,
      });

      if (!res.ok) {
        const { error: errMsg } = await res.json().catch(() => ({}));
        throw new Error(errMsg || `Server responded with ${res.status}`);
      }

      const blob   = await res.blob();
      const url    = URL.createObjectURL(blob);
      currentObjectUrl = url;

      const audio  = new Audio(url);
      currentAudio = audio;

      audio.onplay  = () => { setIsLoading(false); setIsPlaying(true); };
      audio.onended = () => { setIsPlaying(false); stopCurrent(); };
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        setError('Audio playback failed.');
        stopCurrent();
      };

      await audio.play();
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled — not an error

      console.warn('ElevenLabs TTS failed, falling back to browser speech:', err.message);
      setError(null); // Don't show error to user — fall back silently
      setIsLoading(false);

      // ── Browser Speech Synthesis fallback ──────────────────────────────────
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text.trim());
        utter.rate   = 1;
        utter.pitch  = 1;
        utter.volume = 1;
        utter.onstart = () => setIsPlaying(true);
        utter.onend   = () => setIsPlaying(false);
        utter.onerror = () => {
          setIsPlaying(false);
          setError('Speech synthesis also failed.');
        };
        window.speechSynthesis.speak(utter);
      } else {
        setError(err.message || 'TTS is not available.');
      }
    }
  }, [stop]);

  return { speak, stop, isPlaying, isLoading, error };
}
