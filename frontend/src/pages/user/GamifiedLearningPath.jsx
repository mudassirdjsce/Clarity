import React, { useState } from 'react';
import { Lock, Star, CheckCircle, X, Navigation } from 'lucide-react';
import { cn } from '../../lib/utils';

const levelsData = [
  {
    id: 1,
    title: "Beginner: ETF Basics",
    videoUrl: "https://www.youtube.com/embed/OwpFBi-jZVg",
    thumbnail: "https://i.ytimg.com/vi/OwpFBi-jZVg/hq720.jpg",
    questions: [
      { q: "What does ETF stand for?", options: ["Exchange Traded Fund", "Equity Trade Fund", "Exchange Trade Finance"], correct: 0 },
      { q: "What is a primary benefit of ETFs?", options: ["High Risk", "Diversification", "Guaranteed Returns"], correct: 1 },
      { q: "Can you trade ETFs in real-time like stocks?", options: ["Yes", "No", "Only on weekends"], correct: 0 }
    ]
  },
  {
    id: 2,
    title: "Intermediate: Candlesticks",
    videoUrl: "https://www.youtube.com/embed/ul34Jfh-LOk",
    thumbnail: "https://i.ytimg.com/vi/ul34Jfh-LOk/hq720.jpg",
    questions: [
      { q: "What does a green candlestick usually indicate?", options: ["Price went down", "Price went up", "No change"], correct: 1 },
      { q: "What are the 'wicks' on a candlestick called?", options: ["Shadows", "Bodies", "Tails"], correct: 0 },
      { q: "What does a long lower wick suggest?", options: ["Selling pressure", "Buying pressure", "Market closed"], correct: 1 }
    ]
  },
  {
    id: 3,
    title: "Advanced: Stocks vs Bonds",
    videoUrl: "https://www.youtube.com/embed/rs1md3e4aYU",
    thumbnail: "https://i.ytimg.com/vi/rs1md3e4aYU/hq720.jpg",
    questions: [
      { q: "Buying a stock makes you a partial what?", options: ["Creditor", "Owner", "Manager"], correct: 1 },
      { q: "Bonds are generally considered lower risk than stocks.", options: ["True", "False"], correct: 0 },
      { q: "Bond yields have an inverse relationship with bond prices.", options: ["True", "False"], correct: 0 }
    ]
  },
  {
    id: 4,
    title: "Pro: Support & Resistance",
    videoUrl: "https://www.youtube.com/embed/8-x2S8owxYQ",
    thumbnail: "https://i.ytimg.com/vi/8-x2S8owxYQ/hq720.jpg",
    questions: [
      { q: "Support level acts like a what for the price?", options: ["Ceiling", "Floor", "Wall"], correct: 1 },
      { q: "Resistance prevents the price from going what?", options: ["Down", "Up", "Sideways"], correct: 1 },
      { q: "If price breaks resistance, it often becomes what?", options: ["Support", "Resistance", "Gap"], correct: 0 }
    ]
  },
  {
    id: 5,
    title: "Expert: Diversification",
    videoUrl: "https://www.youtube.com/embed/jg_MflByI3Y",
    thumbnail: "https://i.ytimg.com/vi/jg_MflByI3Y/hq720.jpg",
    questions: [
      { q: "Diversification is often called the only what in finance?", options: ["Free Lunch", "Sure Bet", "Risk"], correct: 0 },
      { q: "Why do we diversify?", options: ["To increase returns", "To reduce risk", "To avoid taxes"], correct: 1 },
      { q: "Completing this level grants a Loyalty Bonus!", options: ["Correct", "Skip"], correct: 0 }
    ]
  }
];

function QuizModal({ level, onClose, onPass }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const q = level.questions[currentQIndex];

  const handleNext = () => {
    const isCorrect = selectedOption === q.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQIndex < level.questions.length - 1) {
      setCurrentQIndex(c => c + 1);
      setSelectedOption(null);
    } else {
      setFinalScore(newScore);
      setShowResult(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0f0b] border border-white/10 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {!showResult ? (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-4 font-mono uppercase tracking-widest">
              <span>{level.title}</span>
              <span>Question {currentQIndex + 1} of {level.questions.length}</span>
            </div>
            <h2 className="text-xl font-bold text-[#fafdf5] mb-6 leading-relaxed">{q.q}</h2>
            <div className="space-y-3 mb-8">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 font-medium",
                    selectedOption === i 
                      ? "border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.15)]" 
                      : "border-white/10 hover:bg-white/5 hover:border-white/30 text-white/80"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className="w-full py-3.5 bg-neon-green text-obsidian rounded-xl font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
            >
              {currentQIndex === level.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-4xl font-display font-bold text-[#fafdf5] mb-4">Quiz Complete!</h2>
            <p className="text-lg text-white/60 mb-8">You scored <span className="text-neon-green font-bold text-2xl">{finalScore}</span> out of {level.questions.length}</p>
            {finalScore === level.questions.length ? (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/20 text-neon-green mb-4 border border-neon-green/30 shadow-[0_0_30px_rgba(57,255,20,0.4)]">
                  <Star className="w-8 h-8" fill="currentColor" />
                </div>
                <button onClick={() => onPass()} className="w-full py-4 bg-neon-green text-obsidian rounded-xl font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] transition-all">
                  Claim Reward & Continue
                </button>
              </div>
            ) : (
              <button onClick={onClose} className="w-full py-4 border border-white/20 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-all">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GamifiedLearningPath() {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem('clarityAcademyLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('clarityAcademyPoints');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showBonus, setShowBonus] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Save progress whenever it changes
  React.useEffect(() => {
    localStorage.setItem('clarityAcademyLevel', currentLevel);
  }, [currentLevel]);

  React.useEffect(() => {
    localStorage.setItem('clarityAcademyPoints', userPoints);
    window.dispatchEvent(new Event('pointsUpdate'));
  }, [userPoints]);

  const handlePass = (passedId) => {
    setActiveQuiz(null);
    setUserPoints(p => p + 100);
    
    // Only unlock the next level if we passed the current pending target
    if (passedId === currentLevel) {
      if (passedId === 5) {
        setUserPoints(p => p + 600); // 100 base + 500 bonus
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 4000);
      }
      setCurrentLevel(c => Math.min(c + 1, 6)); // 6 signifies all complete
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-20 px-6 sm:px-12">
      {/* Header and Points */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-[#fafdf5] tracking-tight">Trading Academy</h1>
          <p className="text-white/40 mt-1 uppercase tracking-widest text-xs font-mono">Master The Markets · Interactive Path</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 bg-[#0b0b0b] px-6 py-3 rounded-2xl border border-neon-green/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
            <Star className="w-6 h-6 text-neon-green" fill="currentColor" />
            <span className="font-display font-bold text-2xl text-neon-green">{userPoints} PTS</span>
          </div>
        </div>
      </div>

      {/* Bonus notification */}
      {showBonus && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neon-green text-obsidian px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(57,255,20,0.6)] animate-bounce text-sm flex items-center gap-2">
          <Star fill="currentColor" className="w-5 h-5" />
          Congratulations! Loyalty Bonus Awarded! +500 PTS
        </div>
      )}

      {/* Winding Road Layout */}
      <div className="relative max-w-4xl mx-auto py-8">
        {/* The straight dashed path line for Mobile only */}
        <div className="absolute left-[24px] top-4 bottom-4 w-0 border-l-[3px] border-dashed border-white/20 z-0 md:hidden" />
        
        <div className="space-y-24">
          {levelsData.map((level, idx) => {
            const isLeft = idx % 2 === 0;
            const isLocked = level.id > currentLevel;
            const isCompleted = level.id < currentLevel;
            const isCurrent = level.id === currentLevel;

            return (
              <div key={level.id} className={cn("flex w-full relative z-10 md:justify-end md:[&:nth-child(odd)]:justify-start")}>
                {/* Node Container */}
                <div className={cn("w-full md:w-1/2 flex relative group px-16 md:px-0", isLeft ? "md:pr-36 md:justify-end" : "md:pl-36 md:justify-start")}>
                  
                  {/* Circular Node offset to create snake zigzag */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#0b0f0b] transition-all z-20 shadow-xl",
                    "left-[-8px] md:left-auto", // Responsive positioning of the node
                    isLeft ? "md:right-12" : "md:left-12",
                    isCompleted ? "bg-neon-green text-obsidian shadow-[0_0_20px_rgba(57,255,20,0.4)]" : 
                    isCurrent ? "bg-white text-obsidian shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-pulse" : 
                    "bg-[#1a1c1a] text-white/30 border-white/10"
                  )}>
                    {isLocked ? <Lock className="w-6 h-6" /> : isCompleted ? <CheckCircle className="w-7 h-7" /> : <Navigation className="w-6 h-6 rotate-90" fill="currentColor" />}
                  </div>

                  {/* Desktop Connecting Horizontal dash to card */}
                  <div className={cn("hidden md:block absolute top-1/2 -translate-y-1/2 w-8 border-b-2 border-dashed z-0",
                    isLocked ? "border-white/10" : isCompleted ? "border-neon-green/50" : "border-white/40",
                    isLeft ? "right-28" : "left-28"
                  )} />

                  {/* Curved winding S-path (Desktop) */}
                  {idx < levelsData.length - 1 && (
                    <svg 
                      className={cn("absolute hidden md:block z-[0] pointer-events-none",
                        isLeft ? "-right-20" : "-left-20"
                      )} 
                      style={{ 
                        width: '160px', 
                        height: 'calc(100% + 96px)', 
                        top: '50%'
                      }}
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <path 
                        d={isLeft ? "M 0 0 C 0 50, 100 50, 100 100" : "M 100 0 C 100 50, 0 50, 0 100"} 
                        stroke={isCompleted ? "rgba(57,255,20,0.5)" : "rgba(255,255,255,0.15)"}
                        strokeWidth="2" 
                        strokeDasharray="6 6" 
                        fill="transparent" 
                      />
                    </svg>
                  )}

                  {/* Level Block/Card */}
                  <div className={cn(
                    "bg-[#0a0a0a] border p-6 rounded-2xl transition-all duration-300 w-full relative overflow-hidden group-hover:border-white/20 group-hover:bg-[#111]",
                    isLocked ? "opacity-60 border-white/5 pointer-events-none" : isCompleted ? "border-neon-green/20" : "border-white/10 hover:shadow-2xl"
                  )}>
                    <div className="flex items-center justify-between transition-all">
                      <div>
                        <span className={cn("text-[10px] font-mono tracking-widest uppercase mb-1 block", isCompleted ? "text-neon-green" : "text-white/40")}>Level {level.id}</span>
                        <h3 className={cn("text-xl font-display font-bold text-[#fafdf5] transition-all", !isLocked ? "group-hover:text-neon-green" : "")}>
                          {level.title}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                        {isLocked ? <Lock className="w-4 h-4 text-white/30" /> : <Star className={cn("w-4 h-4", isCompleted ? "text-neon-green" : "text-white/60")} />}
                      </div>
                    </div>
                    
                    {/* Hover to reveal content (Video + Quiz) */}
                    {!isLocked && (
                      <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-6 transition-all duration-500 overflow-hidden flex flex-col gap-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/50 relative">
                          {playingVideoId === level.id ? (
                            <iframe 
                              className="absolute inset-0 w-full h-full"
                              src={`${level.videoUrl}?autoplay=1`} 
                              title={level.title} 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen 
                            />
                          ) : (
                            <div 
                              className="absolute inset-0 w-full h-full cursor-pointer bg-cover bg-center group/vid"
                              style={{ backgroundImage: `url(${level.thumbnail})` }}
                              onClick={() => setPlayingVideoId(level.id)}
                            >
                              <div className="absolute inset-0 bg-black/40 group-hover/vid:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 bg-neon-green text-obsidian rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(57,255,20,0.5)] group-hover/vid:scale-110 transition-transform">
                                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setActiveQuiz(level)}
                          className={cn(
                            "w-full py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all",
                            isCompleted 
                              ? "bg-transparent border border-neon-green/30 text-neon-green hover:bg-neon-green/10" 
                              : "bg-white text-obsidian hover:bg-neon-green hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                          )}
                        >
                          {isCompleted ? "Retake Quiz" : "Start Quiz"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Modal Render */}
      {activeQuiz && (
        <QuizModal 
          level={activeQuiz} 
          onClose={() => setActiveQuiz(null)}
          onPass={() => handlePass(activeQuiz.id)}
        />
      )}
    </div>
  );
}
