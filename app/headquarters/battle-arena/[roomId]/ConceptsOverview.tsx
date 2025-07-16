import React, { useState, useEffect } from "react";

const ConceptsOverview: React.FC<{
  setGameMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setGameMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showModal, setShowModal] = useState(false);

  const rust_concepts = [
    {
      title: "Ownership",
      description:
        "Ownership is Rust's core memory safety model. Each value in Rust has a single owner, and when ownership is transferred, the previous variable becomes invalid. This system eliminates data races and ensures memory safety without a garbage collector.",
    },
    {
      title: "Borrowing and References",
      description:
        "Borrowing allows you to refer to a value without taking ownership of it. References can be either immutable or mutable, but never both at the same time for the same data. This helps Rust enforce safe concurrency and prevent data corruption.",
    },
    {
      title: "Pattern Matching",
      description:
        "Pattern matching in Rust uses the `match` keyword to destructure and compare values in a concise, readable way. It's commonly used with enums and Option/Result types, enabling robust error handling and control flow logic.",
    },
    {
      title: "Traits",
      description:
        "Traits are similar to interfaces in other languages, defining shared behavior that types can implement. They enable polymorphism and allow for generic programming, making Rust code more flexible and reusable.",
    },
    {
      title: "Concurrency with `tokio`",
      description:
        "`tokio` is a popular asynchronous runtime in Rust that enables scalable, non-blocking I/O operations. It powers concurrent applications using `async`/`await`, helping developers build fast, efficient network services and background jobs.",
    },
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleReady(); // Auto-start when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage for circular progress
  const progressPercentage = ((300 - timeLeft) / 300) * 100;

  const handleNext = () => {
    if (currentIndex < rust_concepts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReady = () => {
    // Handle ready signal - you can replace this with your actual logic
    console.log("Player is ready to start the game!");
    setGameMode("quiz");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Truncate description for preview (first 150 characters)
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const currentConcept = rust_concepts[currentIndex];
  const isLastConcept = currentIndex === rust_concepts.length - 1;

  return (
    <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-40 flex items-center justify-center mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Timer */}
        <div className="text-center mb-8">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-[#cd7f32] mb-4">
            Rust Concepts Overview
          </h2> */}

          {/* Animated Countdown Timer */}
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={timeLeft <= 60 ? "#ef4444" : "#cd7f32"}
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage}, 100`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-lg font-bold ${
                    timeLeft <= 60 ? "text-red-400" : "text-[#cd7f32]"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-lg">
            Learn these concepts before entering the undead realm
          </p>
          <p
            className={`text-sm mt-2 ${
              timeLeft <= 60 ? "text-red-400" : "text-gray-400"
            }`}
          >
            {timeLeft <= 60
              ? "⚠️ Time running out!"
              : "Game starts automatically when timer expires"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {rust_concepts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#cd7f32] scale-125"
                    : index < currentIndex
                    ? "bg-[#cd7f32]/60"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Concept content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-black/30 rounded-2xl p-8 border border-[#cd7f32]/30 mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-[#ff8c42] mb-6 text-center">
              {currentConcept.title}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed text-center mb-4">
              {truncateDescription(currentConcept.description)}
            </p>
            {currentConcept.description.length > 150 && (
              <div className="text-center">
                <button
                  onClick={openModal}
                  className="text-[#cd7f32] hover:text-[#ff8c42] font-semibold underline transition-colors duration-200 cursor-pointer"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentIndex === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105"
            }`}
          >
            Previous
          </button>

          <span className="text-[#cd7f32] font-semibold">
            {currentIndex + 1} of {rust_concepts.length}
          </span>

          {isLastConcept ? (
            <button
              onClick={handleReady}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Ready to Fight! ⚔️
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 transition-all duration-200"
            >
              Next
            </button>
          )}
        </div>

        {/* Timer warning overlay */}
        {timeLeft <= 10 && timeLeft > 0 && (
          <div className="absolute inset-0 bg-red-900/20 rounded-3xl flex items-center justify-center z-20">
            <div className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-red-400 mb-4 animate-pulse">
                {timeLeft}
              </div>
              <p className="text-red-200 text-xl font-semibold">
                Game starting in...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for full description */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 mx-auto">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-2xl"></div>

            <div className="relative z-10">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#ff8c42]">
                  {currentConcept.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-[#cd7f32] transition-colors duration-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="bg-black/30 rounded-xl p-6 border border-[#cd7f32]/30">
                <p className="text-gray-200 text-lg leading-relaxed">
                  {currentConcept.description}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black hover:from-[#ff8c42] hover:to-[#cd7f32] transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptsOverview;
