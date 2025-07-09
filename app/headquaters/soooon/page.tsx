"use client";
import { useState, useEffect } from "react";
import { Bell, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ComingSoon: React.FC = () => {
  // Launch date - set this to your actual launch date
  const launchDate = new Date("2025-03-01T00:00:00Z");

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState<string>("");
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setEmail("");

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cd7f32]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff8c42]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* Hero Image */}
        <div className="mb-12 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/30 to-[#ff8c42]/30 rounded-full blur-xl animate-pulse"></div>

            <div className="relative w-32 h-32 pt-12 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-[#cd7f32]/50 shadow-2xl group-hover:scale-105 group-hover:border-[#cd7f32] transition-all duration-500 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
              <Image
                src="/main.png"
                alt="Rust Undead - Coming Soon"
                width={256}
                height={256}
                priority
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#cd7f32]/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#cd7f32] via-[#ff8c42] to-[#cd7f32] bg-clip-text text-transparent leading-tight">
          Coming Soon
        </h1>
      </div>

      {/* Subtle background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-[#cd7f32]/30 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#ff8c42]/40 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-[#cd7f32]/20 rounded-full animate-bounce delay-3000"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-[#ff8c42]/30 rounded-full animate-ping delay-4000"></div>
      </div>
    </div>
  );
};

export default ComingSoon;
