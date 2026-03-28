import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useTTS } from '../../hooks/useTTS';
import { useTranslation } from 'react-i18next';

/**
 * SpeakButton – a self-contained speaker button that reads `text` aloud.
 *
 * Props:
 *   text     {string}   – text to speak
 *   className {string}  – optional extra classes
 *   compact   {boolean} – if true, renders a small icon-only button
 */
export function SpeakButton({ text, className, compact = true }) {
  const { speak, stop, isPlaying, isLoading } = useTTS();
  const { t } = useTranslation();

  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(text);
    }
  };

  if (!text?.trim()) return null;

  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleClick}
        title={isPlaying ? t('stop_reading') : t('read_aloud')}
        disabled={isLoading}
        className={cn(
          'p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100',
          isPlaying
            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
            : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10 border border-transparent',
          isLoading && 'opacity-60 cursor-wait',
          className
        )}
      >
        {isLoading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : isPlaying
            ? <VolumeX className="w-3.5 h-3.5" />
            : <Volume2 className="w-3.5 h-3.5" />
        }
      </motion.button>
    );
  }

  // Full (non-compact) variant for news cards etc.
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold',
        'transition-all duration-200 border',
        isPlaying
          ? 'bg-neon-green/15 text-neon-green border-neon-green/30 shadow-[0_0_12px_rgba(57,255,20,0.15)]'
          : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10',
        className
      )}
    >
      {isLoading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : isPlaying
          ? <VolumeX className="w-3.5 h-3.5" />
          : <Volume2 className="w-3.5 h-3.5" />
      }
      {isLoading ? t('generating') : isPlaying ? t('stop_reading') : t('read_aloud')}
    </motion.button>
  );
}
