"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export function LoadingModal() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative animate-pulse">
            <Image
              src="/main.png"
              alt="Rust Undead"
              width={280}
              height={280}
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-[#cd7f32] tracking-wide">
            Rust Undead
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Awakening the undead minds...
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-80 bg-[#2a2a2a] rounded-full h-3 border border-[#cd7f32]/20">
            <div
              className="h-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Loading</span>
            <span className="text-[#cd7f32] font-mono font-bold text-lg">
              {progress}%
            </span>
            <span className="text-gray-500">Ready</span>
          </div>
        </div>

        {/* Flavor Text */}
        <p className="text-sm text-[#cd7f32]/70 italic mt-6">
          "Knowledge feeds the undead mind..."
        </p>
      </div>
    </div>
  );
}
