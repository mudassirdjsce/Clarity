import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useObjectDetection
 * Custom hook that manages webcam access + COCO-SSD object detection.
 *
 * Returns:
 *  videoRef        — attach to <video> element
 *  detectedObject  — top-1 class name (string | null)
 *  confidence      — 0–100 number
 *  topPredictions  — up to 3 objects for the bonus multi-label display
 *  loading         — model/stream is initialising
 *  error           — permission denied or any other error message
 *  isActive        — camera is running
 *  startDetection  — () => Promise<void>
 *  stopDetection   — () => void
 */
export default function useObjectDetection() {
  const videoRef          = useRef(null);
  const streamRef         = useRef(null);
  const modelRef          = useRef(null);
  const intervalRef       = useRef(null);
  const mountedRef        = useRef(true);

  const [detectedObject,  setDetectedObject]  = useState(null);
  const [confidence,      setConfidence]      = useState(0);
  const [topPredictions,  setTopPredictions]  = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [isActive,        setIsActive]        = useState(false);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopDetection();
    };
  }, []);

  // ── Stop camera & detection loop ────────────────────────────────────────────
  const stopDetection = useCallback(() => {
    // Clear detection interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Stop all media tracks so camera light turns off
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (mountedRef.current) {
      setIsActive(false);
      setDetectedObject(null);
      setConfidence(0);
      setTopPredictions([]);
    }
  }, []);

  // ── Load model lazily ───────────────────────────────────────────────────────
  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    // Dynamic import so TF.js is only loaded when scanner opens
    const tf      = await import('@tensorflow/tfjs');
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    // Use 'lite_mobilenet_v2' for speed; default is mobilenet_v2
    const model   = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    modelRef.current = model;
    return model;
  }, []);

  // ── Start camera + detection ────────────────────────────────────────────────
  const startDetection = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    setDetectedObject(null);
    setConfidence(0);

    try {
      // 1. Request camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',  // prefer rear camera on mobile
          width:  { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        await videoRef.current.play();
      }

      // 2. Load TF model
      const model = await loadModel();
      if (!mountedRef.current) return;

      setIsActive(true);
      setLoading(false);

      // 3. Detection loop — every 400ms for performance
      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || !mountedRef.current || !model) return;
        if (videoRef.current.readyState < 2) return; // not yet ready

        try {
          const predictions = await model.detect(videoRef.current);
          if (!mountedRef.current) return;

          if (predictions.length > 0) {
            // Sort by confidence descending
            const sorted = [...predictions].sort((a, b) => b.score - a.score);
            const top    = sorted[0];
            setDetectedObject(top.class);
            setConfidence(Math.round(top.score * 100));
            setTopPredictions(sorted.slice(0, 3));
          } else {
            setDetectedObject(null);
            setConfidence(0);
            setTopPredictions([]);
          }
        } catch {
          // silently ignore frame errors
        }
      }, 400);

    } catch (err) {
      if (!mountedRef.current) return;
      setLoading(false);
      setIsActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access is required to scan products. Please allow camera permission.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Could not start the camera. Please try again.');
      }
    }
  }, [loadModel]);

  return {
    videoRef,
    detectedObject,
    confidence,
    topPredictions,
    loading,
    error,
    isActive,
    startDetection,
    stopDetection,
  };
}
