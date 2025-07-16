"use client";
import React, { useState } from "react";
import { audioManager } from "@/utils/audioManager";
import { Plus, Sword, Trophy, ChartBar, Star } from "lucide-react";
import { Shield } from "lucide-react";
import RoomCreation from "./CreateRoom";

interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}

const BattleArena = () => {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [gameMode, setGameMode] = useState("");
  const quickActions: QuickAction[] = [
    {
      id: "create-room",
      label: "Create a room",
      onClick: () => {
        audioManager.playSound("forge");
        setGameMode("creation");
        // handleNavigate("warriors");
      },
      icon: Plus,
      primary: true,
    },
    {
      id: "join-room",
      label: "Join a room",
      onClick: () => {
        audioManager.playSound("battle");
        // handleNavigate("battle");
      },
      icon: Shield,
    },
  ];
  return (
    <>
      <RoomCreation gameMode={gameMode} setGameMode={setGameMode} />
      <main className=" flex-col justify-between gap-y-10  flex p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Warriors Stat */}
          <div className="bg-[#1a1a1a] border flex flex-col border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 gap-2  sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
                <Sword className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
              </div>
              <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
                Battles Fought
              </h3>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
              {/* {userWarriors.length} */}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">10</div>
          </div>

          {/* Victories Stat */}
          <div className="bg-[#1a1a1a] border flex flex-col border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 gap-2  sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
              </div>
              <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
                Victories
              </h3>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
              {/* {userProfile?.totalBattlesWon || 0} */}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">4</div>
          </div>

          {/* Power Stat */}
          <div className="bg-[#1a1a1a] border flex flex-col border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 gap-5  sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
                <ChartBar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
              </div>
              <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
                Leaderboard
              </h3>
            </div>
            <div className="text-xs font-bold text-white mb-1">Coming Soon</div>
            <div className="text-xs sm:text-sm text-gray-400">Position</div>
          </div>

          {/* Progress Stat */}
          <div className="bg-[#1a1a1a] border flex flex-col border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 gap-5  sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
              </div>
              <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
                Favourite Warrior
              </h3>
            </div>
            <div className="text-xs font-bold text-white mb-1">Coming Soon</div>
            <div className="text-xs sm:text-sm text-gray-400">Academy</div>
          </div>
        </div>

        <section className="flex gap-x-4 flex-row mx-auto">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`font-bold p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  action.primary
                    ? "bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black hover:shadow-lg hover:shadow-[#cd7f32]/25"
                    : "bg-[#1a1a1a] border border-[#cd7f32]/50 hover:bg-[#cd7f32]/10 hover:border-[#cd7f32] text-[#cd7f32]"
                }`}
              >
                 {/* <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div> */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  <span className="text-sm sm:text-base lg:text-lg">
                    {action.label}
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      </main>
    </>
  );
};

export default BattleArena;
