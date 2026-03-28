import { useState, useRef, useEffect, useCallback } from 'react';

// ── Static imports — Vite handles these correctly with optimizeDeps.exclude ──
// We import the modules at the top level but only CALL them (load model / get stream)
// when startDetection() is invoked, so there's zero performance cost at page load.
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

/**
 * useObjectDetection
 * Custom hook that manages webcam access + COCO-SSD object detection.
 *
 * Returns:
 *  videoRef        — attach to <video> element
 *  detectedObject  — top-1 class name (string | null)
 *  confidence      — 0–100 number
 *  topPredictions  — up to 3 objects for multi-label display
 *  loading         — model/stream is initialising
 *  error           — permission denied or any other error message
 *  isActive        — camera is running
 *  startDetection  — () => Promise<void>
 *  stopDetection   — () => void
 */
export default function useObjectDetection() {
  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const modelRef    = useRef(null);
  const intervalRef = useRef(null);
  const mountedRef  = useRef(true);

  const [detectedObject,  setDetectedObject]  = useState(null);
  const [confidence,      setConfidence]      = useState(0);
  const [topPredictions,  setTopPredictions]  = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [isActive,        setIsActive]        = useState(false);

  // ── Mark unmounted on cleanup ───────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Stop everything when the component using this hook unmounts
      _stopAll();
    };
  }, []);

  // ── Internal stop helper (no setState guard needed here) ───────────────────
  const _stopAll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ── Public stop ─────────────────────────────────────────────────────────────
  const stopDetection = useCallback(() => {
    _stopAll();
    if (mountedRef.current) {
      setIsActive(false);
      setDetectedObject(null);
      setConfidence(0);
      setTopPredictions([]);
      setError(null);
    }
  }, []);

  // ── Load COCO-SSD model (only once per session) ─────────────────────────────
  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    // Use lite_mobilenet_v2 base for faster inference on consumer hardware
    const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    modelRef.current = model;
    return model;
  }, []);

  // ── Start camera + detection loop ────────────────────────────────────────────
  const startDetection = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    setDetectedObject(null);
    setConfidence(0);
    setTopPredictions([]);

    try {
      // 1. Request camera — prefer rear camera on mobile, 640×480 for perf
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width:  { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      // 2. Attach to <video>
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = resolve;
          videoRef.current.onerror = reject;
        });
        await videoRef.current.play().catch(() => {});
      }

      // 3. Load model
      const model = await loadModel();
      if (!mountedRef.current) return;

      setIsActive(true);
      setLoading(false);

      // 4. Detection loop every 400ms
      intervalRef.current = setInterval(async () => {
        if (
          !videoRef.current ||
          !mountedRef.current ||
          !model ||
          videoRef.current.readyState < 2 ||
          videoRef.current.paused
        ) return;

        try {
          const predictions = await model.detect(videoRef.current);
          if (!mountedRef.current) return;

          if (predictions && predictions.length > 0) {
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
          // ignore per-frame errors silently
        }
      }, 400);

    } catch (err) {
      if (!mountedRef.current) return;
      setLoading(false);
      setIsActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access is required to scan products. Please allow camera permission and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera device found on this device.');
      } else {
        setError(`Could not start the camera: ${err.message}`);
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
