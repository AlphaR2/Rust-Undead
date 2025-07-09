"use client";
import React, { useState } from "react";
import { Warrior, WarriorClass } from "@/types/undead";
import { WARRIOR_CLASS_INFO } from "@/hooks/useGameActions";

interface WarriorCardProps {
  warrior: Warrior;
  selectedClass: WarriorClass | null;
  warriorName: string;
  onFlip?: () => void;
}

const WarriorCard: React.FC<WarriorCardProps> = ({
  warrior,
  selectedClass,
  warriorName,
  onFlip,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const classInfo = selectedClass ? WARRIOR_CLASS_INFO[selectedClass] : null;

  return (
    <>
      <div className="relative w-80 h-96 cursor-pointer perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleCardClick}
        >
          {/* Front of Card - Pure Image */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full border-4 border-[#cd7f32] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#cd7f32]/50 transition-shadow duration-300">
              {warrior.imageUri ? (
                <img
                  src={warrior.imageUri}
                  alt="Warrior NFT"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const fallback = (e.target as HTMLImageElement)
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}

              {/* Fallback if image fails or doesn't exist */}
              <div
                className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center"
                style={{ display: warrior.imageUri ? "none" : "flex" }}
              >
                <div className="text-center">
                  <div className="text-8xl mb-4">{classInfo?.icon || "⚔️"}</div>
                  <div className="text-xl text-[#cd7f32] font-bold">
                    {warriorName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card - Stats Only */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-4 border-[#cd7f32] rounded-2xl p-6 flex flex-col justify-center shadow-2xl">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 w-full">
                {/* Attack Stat */}
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">⚔️</div>
                      <div className="text-2xl font-bold text-red-400">
                        Attack
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-400">
                      {warrior.baseAttack}
                    </div>
                  </div>
                </div>

                {/* Defense Stat */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🛡️</div>
                      <div className="text-2xl font-bold text-blue-400">
                        Defense
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-blue-400">
                      {warrior.baseDefense}
                    </div>
                  </div>
                </div>

                {/* Knowledge Stat */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🧠</div>
                      <div className="text-2xl font-bold text-purple-400">
                        Knowledge
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-purple-400">
                      {warrior.baseKnowledge}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
};

export default WarriorCard;
