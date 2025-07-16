import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Timer, AlertTriangle, Zap, Skull, Trophy, Target, Brain, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation?: string;
}

interface FeedbackOverlayProps {
  isCorrect: boolean;
  isVisible: boolean;
  onAnimationComplete: () => void;
  playerName: string;
  feedbackType: 'correct' | 'incorrect' | 'timeout';
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isCorrect,
  isVisible,
  onAnimationComplete,
  playerName,
  feedbackType
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('enter');
      
      const enterTimer = setTimeout(() => {
        setAnimationPhase('display');
      }, 300);

      const exitTimer = setTimeout(() => {
        setAnimationPhase('exit');
      }, 2500);

      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, 3000);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onAnimationComplete]);

  const praises = [
    {
      text: "Rust ninja! 🥷",
      icon: <Target className="text-yellow-400" size={24} />,
      color: "text-green-400"
    },
    {
      text: "Memory safe and sound! 🔒",
      icon: <Brain className="text-blue-400" size={24} />,
      color: "text-blue-400"
    },
    {
      text: "Zero-cost abstraction master! ⚡",
      icon: <Zap className="text-yellow-400" size={24} />,
      color: "text-yellow-400"
    },
    {
      text: "Blazingly fast answer! 🔥",
      icon: <Zap className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Ownership model expert! 👑",
      icon: <Trophy className="text-yellow-400" size={24} />,
      color: "text-yellow-400"
    },
    {
      text: "Fearless concurrency! 💪",
      icon: <ThumbsUp className="text-green-400" size={24} />,
      color: "text-green-400"
    }
  ];

  const roasts = [
    {
      text: "Borrow checker would be disappointed... 😅",
      icon: <Skull className="text-red-400" size={24} />,
      color: "text-red-400"
    },
    {
      text: "That's a compile-time error in knowledge! 💥",
      icon: <Zap className="text-red-400" size={24} />,
      color: "text-red-400"
    },
    {
      text: "Your understanding just got moved! 📦",
      icon: <ThumbsDown className="text-red-400" size={24} />,
      color: "text-red-400"
    },
    {
      text: "Time to revisit the Rust Book! 📚",
      icon: <Brain className="text-red-400" size={24} />,
      color: "text-red-400"
    },
    {
      text: "Panic! at the disco(de)... 🎵",
      icon: <Zap className="text-red-400" size={24} />,
      color: "text-red-400"
    },
    {
      text: "Unsafe code in your brain! ⚠️",
      icon: <Skull className="text-red-400" size={24} />,
      color: "text-red-400"
    }
  ];

  const timeoutRoasts = [
    {
      text: "Rust doesn't wait for anyone... ⏰",
      icon: <Clock className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Time's up! Even async/await has limits! ⏱️",
      icon: <Timer className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Slower than a debug build! 🐌",
      icon: <AlertTriangle className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Your response timed out! 💤",
      icon: <Clock className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Blocking the main thread! 🚫",
      icon: <XCircle className="text-orange-400" size={24} />,
      color: "text-orange-400"
    },
    {
      text: "Deadlock detected in your brain! 🧠",
      icon: <Brain className="text-orange-400" size={24} />,
      color: "text-orange-400"
    }
  ];

  if (!isVisible) return null;

  const getFeedbackArray = () => {
    if (feedbackType === 'timeout') return timeoutRoasts;
    return isCorrect ? praises : roasts;
  };

  const feedback = getFeedbackArray();
  const randomFeedback = feedback[Math.floor(Math.random() * feedback.length)];

  const getAnimationClasses = () => {
    switch (animationPhase) {
      case 'enter':
        return 'animate-fadeInScale opacity-0 scale-50';
      case 'display':
        return 'animate-bounce opacity-100 scale-100';
      case 'exit':
        return 'animate-fadeOutScale opacity-0 scale-75';
      default:
        return 'opacity-0 scale-50';
    }
  };

  const getBackgroundColor = () => {
    if (feedbackType === 'timeout') return 'bg-gradient-to-r from-orange-900/90 to-amber-900/90';
    return isCorrect 
      ? 'bg-gradient-to-r from-green-900/90 to-emerald-900/90' 
      : 'bg-gradient-to-r from-red-900/90 to-rose-900/90';
  };

  const getBorderColor = () => {
    if (feedbackType === 'timeout') return 'border-orange-400';
    return isCorrect ? 'border-green-400' : 'border-red-400';
  };

  const getResultText = () => {
    if (feedbackType === 'timeout') return 'Time\'s Up!';
    return isCorrect ? 'Correct!' : 'Wrong!';
  };

  const getResultColor = () => {
    if (feedbackType === 'timeout') return 'text-orange-400';
    return isCorrect ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`
        ${getBackgroundColor()} 
        ${getBorderColor()} 
        border-2 rounded-lg p-8 max-w-md mx-4 text-center transition-all duration-300
        ${getAnimationClasses()}
      `}>
        
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className={`
            p-3 rounded-full transition-all duration-300
            ${feedbackType === 'timeout' ? 'bg-orange-500/20' : isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}
          `}>
            {randomFeedback.icon}
          </div>
        </div>

        {/* Result */}
        <div className="mb-4">
          <h2 className={`text-2xl font-bold mb-2 ${getResultColor()}`}>
            {getResultText()}
          </h2>
          <p className="text-gray-300 text-sm">
            {playerName}
          </p>
        </div>

        {/* Feedback Message */}
        <div className={`text-lg font-medium ${randomFeedback.color} mb-4`}>
          {randomFeedback.text}
        </div>

        {/* Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full animate-ping
                ${feedbackType === 'timeout' ? 'bg-orange-400' : isCorrect ? 'bg-green-400' : 'bg-red-400'}
              `}
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${20 + (i * 8)}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default FeedbackOverlay