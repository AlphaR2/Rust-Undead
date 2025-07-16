import React, { useState, useEffect } from "react";
import FeedbackOverlay from "./FeedbackOverlay";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation?: string;
}

interface RustQuizProps {
  playerName: string;
  onQuizComplete: (score: number, totalQuestions: number) => void;
}
const questions: Question[] = [
  {
    id: 1,
    question: "In Rust, variables are mutable by default.",
    correctAnswer: false,
    explanation:
      "Variables in Rust are immutable by default. You need to use 'mut' keyword to make them mutable.",
  },
  {
    id: 2,
    question: "Rust has a garbage collector for memory management.",
    correctAnswer: false,
    explanation:
      "Rust uses ownership system for memory management, not a garbage collector.",
  },
  {
    id: 3,
    question: "The borrow checker prevents data races at compile time.",
    correctAnswer: true,
    explanation:
      "The borrow checker ensures memory safety and prevents data races at compile time.",
  },
  {
    id: 4,
    question: "Rust allows null pointer dereferences.",
    correctAnswer: false,
    explanation:
      "Rust prevents null pointer dereferences by not having null pointers. It uses Option<T> instead.",
  },
  {
    id: 5,
    question: "Traits in Rust are similar to interfaces in other languages.",
    correctAnswer: true,
    explanation:
      "Traits define shared behavior that types can implement, similar to interfaces.",
  },
  {
    id: 6,
    question: "Rust supports inheritance like traditional OOP languages.",
    correctAnswer: false,
    explanation:
      "Rust doesn't support inheritance. It uses composition and traits instead.",
  },
  {
    id: 7,
    question: "The 'match' keyword is used for pattern matching in Rust.",
    correctAnswer: true,
    explanation:
      "The 'match' keyword is Rust's primary pattern matching construct.",
  },
  {
    id: 8,
    question:
      "Rust's ownership system allows multiple mutable references to the same data.",
    correctAnswer: false,
    explanation:
      "Rust's ownership system prevents multiple mutable references to the same data.",
  },
];

const RustQuiz: React.FC<RustQuizProps> = ({ playerName, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    "correct" | "incorrect" | "timeout"
  >("correct");
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isTimedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswered, isTimedOut]);

  const handleTimeout = () => {
    setIsTimedOut(true);
    setFeedbackType("timeout");
    // setShowFeedback(true);
  };

  const handleAnswer = (answer: boolean) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setFeedbackType(isCorrect ? "correct" : "incorrect");
    setShowFeedback(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);

    if (isLastQuestion) {
      onQuizComplete(score, questions.length);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setIsTimedOut(false);
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return "text-red-400";
    if (timeLeft <= 10) return "text-orange-400";
    return "text-[#cd7f32]";
  };

  const getTimerBorderColor = () => {
    if (timeLeft <= 5) return "border-red-400";
    if (timeLeft <= 10) return "border-orange-400";
    return "border-[#cd7f32]";
  };

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto">
            {/* <img
              className="rounded-full h-40 w-40"
              src={
                "https://res.cloudinary.com/deensvquc/image/upload/v1752663001/Untitled_95_x_95_px_7_exncym.gif"
              }
              alt="zombie-gif"
            /> */}
          </div>
          <p className="text-gray-300 text-lg">
            {playerName} • Question {currentQuestionIndex + 1} of{" "}
            {questions.length}
          </p>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  timeLeft <= 5
                    ? "#ef4444"
                    : timeLeft <= 10
                    ? "#f59e0b"
                    : "#cd7f32"
                }
                strokeWidth="2"
                strokeDasharray={`${progressPercentage}, 100`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getTimerColor()}`}>
                  {timeLeft}
                </div>
                <div className="text-xs text-gray-400">sec</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-black/30 rounded-2xl p-8 border border-[#cd7f32]/30 mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 text-center leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleAnswer(true)}
              disabled={isAnswered}
              className={`
                p-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2
                ${
                  isAnswered
                    ? selectedAnswer === true
                      ? currentQuestion.correctAnswer === true
                        ? "bg-green-600 border-green-400 text-white"
                        : "bg-red-600 border-red-400 text-white"
                      : "bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] border-[#cd7f32] text-black hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 cursor-pointer"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={24} />
                TRUE
              </div>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              disabled={isAnswered}
              className={`
                p-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2
                ${
                  isAnswered
                    ? selectedAnswer === false
                      ? currentQuestion.correctAnswer === false
                        ? "bg-green-600 border-green-400 text-white"
                        : "bg-red-600 border-red-400 text-white"
                      : "bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] border-[#cd7f32] text-black hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 cursor-pointer"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle size={24} />
                FALSE
              </div>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>
              Score: {score}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Warning for low time */}
        {timeLeft <= 5 && timeLeft > 0 && !isAnswered && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-400 rounded-lg px-4 py-2 animate-pulse">
              <AlertTriangle className="text-red-400" size={20} />
              <span className="text-red-400 font-semibold">Hurry up!</span>
            </div>
          </div>
        )}

        {/* Time's up message */}
        {isTimedOut && !isAnswered && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-400 rounded-lg px-4 py-2">
              <AlertTriangle className="text-red-400" size={20} />
              <span className="text-red-400 font-semibold">
                Time's up! Please answer to continue.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      <FeedbackOverlay
        isCorrect={selectedAnswer === currentQuestion.correctAnswer}
        isVisible={showFeedback}
        onAnimationComplete={handleFeedbackComplete}
        playerName={playerName}
        feedbackType={feedbackType}
      />
    </div>
  );
};

// Demo Component
const QuizDemo: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [playingIntro, setPlayingIntro] = useState(false);

  // Replace with your actual intro video URL
  const introVideoUrl =
    "https://res.cloudinary.com/deensvquc/video/upload/v1752664387/0716_1_ddwtvg.mp4"; // Replace with your video URL

  const handleStartQuiz = () => {
    setPlayingIntro(true);
    setTimeout(() => {
      setShowIntro(false);
      setShowQuiz(true);
      setPlayingIntro(false);
    }, 8000);
    setQuizComplete(false);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setFinalScore(score);
    setTotalQuestions(total);
    setQuizComplete(true);
    setShowQuiz(false);
  };

  const handleRestart = () => {
    setShowQuiz(false);
    setQuizComplete(false);
    setFinalScore(0);
    setTotalQuestions(0);
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 relative z-40">
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-2xl w-full text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-[#cd7f32] mb-4">
              Battle Is Over!
            </h2>
            <p className="text-2xl text-white mb-4">
              Final Score: {finalScore}/{totalQuestions}
            </p>
            <p className="text-gray-300 mb-8">
              {finalScore >= totalQuestions * 0.8
                ? "Excellent work! You're ready for the undead realm! 🔥"
                : finalScore >= totalQuestions * 0.6
                ? "Good job! Keep practicing those Rust concepts! 💪"
                : "Time to study more Rust! Don't give up! 📚"}
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-semibold rounded-lg hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 transition-all duration-200"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4 backdrop-blur-sm relative z-30">
        <RustQuiz
          playerName="Test Player"
          onQuizComplete={handleQuizComplete}
        />
      </div>
    );
  }

  if (playingIntro) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4 relative z-40">
        <div className="relative w-full max-w-4xl">
          <video
            className="w-full h-auto rounded-2xl shadow-2xl border-2 border-[#cd7f32]/50"
            autoPlay
            muted
            style={{ maxHeight: "80vh" }}
          >
            <source src={introVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Loading overlay with countdown */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#cd7f32] mb-4 mx-auto"></div>
              <p className="text-white text-xl font-semibold">
                Preparing Battle...
              </p>
              <p className="text-gray-300 text-sm mt-2">Loading in progress</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial start screen
  return (
    <div className="min-h-screen  flex items-center justify-center p-4 z-40 relative">
      <div className="border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-2xl w-full text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#cd7f32] mb-6">
            Rust Quiz Challenge
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Test your knowledge of Rust programming language with our
            interactive quiz!
          </p>

          <button
            onClick={handleStartQuiz}
            className="px-8 py-4 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-semibold rounded-lg hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 transition-all duration-200 text-xl"
          >
            Start Quiz Battle!
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDemo;
