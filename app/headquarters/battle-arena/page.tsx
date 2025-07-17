"use client";
import React, { useState } from "react";
import { audioManager } from "@/utils/audioManager";
import {
  Plus,
  Shield,
  Swords,
  Calendar,
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Users,
  Timer,
  ArrowRight,
  Flame,
} from "lucide-react";
import RoomCreation from "./CreateRoom";
import { useGameData } from "@/hooks/useGameData";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
  gradient?: string;
  hoverGradient?: string;
}

const BattleArena = () => {
  const [gameMode, setGameMode] = useState("");
  const { userProfile } = useGameData();

  // Helper function to calculate win rate
  const getWinRate = (): number => {
    if (!userProfile || userProfile.totalBattlesFought === 0) return 0;
    return Math.round(
      (userProfile.totalBattlesWon / userProfile.totalBattlesFought) * 100
    );
  };

  // Helper function to format join date
  const formatJoinDate = (): string => {
    if (!userProfile?.joinDate) return "Unknown";
    const date = new Date(userProfile.joinDate * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const quickActions: QuickAction[] = [
    {
      id: "create-room",
      label: "Forge Battle",
      description: "Create your own arena and invite warriors",
      onClick: () => {
        audioManager.playSound("forge");
        setGameMode("creation");
      },
      icon: Plus,
      primary: true,
      gradient: "from-[#cd7f32] via-[#ff8c42] to-[#ffa500]",
      hoverGradient: "from-[#ff8c42] via-[#ffa500] to-[#cd7f32]",
    },
    {
      id: "join-room",
      label: "Enter Battle",
      description: "Join an existing arena and prove your worth",
      onClick: () => {
        audioManager.playSound("battle");
      },
      icon: Shield,
      gradient: "from-[#4a5568] via-[#2d3748] to-[#1a202c]",
      hoverGradient: "from-[#2d3748] via-[#4a5568] to-[#718096]",
    },
  ];

  const features = [
    {
      icon: Swords,
      title: "Strategic Combat",
      description: "Turn-based battles where knowledge is power",
    },
    {
      icon: Zap,
      title: "Real-time Action",
      description: "Lightning-fast responses determine victory",
    },
    {
      icon: Crown,
      title: "Rank Progression",
      description: "Climb the leaderboards with each victory",
    },
  ];

  return (
    <>
      <RoomCreation gameMode={gameMode} setGameMode={setGameMode} />

      <main className="min-h-screen relative overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] rounded-2xl shadow-lg shadow-[#cd7f32]/25">
                <Flame className="w-12 h-12 text-black animate-pulse" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#cd7f32] leading-tight">
              BATTLE ARENA
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Enter the ultimate proving ground where warriors clash in epic
              battles of wit and strategy
            </p>

            {/* Live Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-[#cd7f32]">
                <Users className="w-5 h-5" />
                <span className="font-bold">Warriors Online</span>
              </div>
              <div className="w-2 h-2 bg-[#cd7f32] rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2 text-[#cd7f32]">
                <Timer className="w-5 h-5" />
                <span className="font-bold"> Active Battles</span>
              </div>
            </div>
          </div>

          {/* Player Stats Card */}
          <div className="w-full max-w-5xl mb-16">
            <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#cd7f32]/10 rounded-lg">
                  <Trophy className="w-8 h-8 text-[#cd7f32]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#cd7f32]">
                    Warrior Statistics
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your battle performance and achievements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Total Battles */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Swords className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {userProfile?.totalBattlesFought || 0}
                  </div>
                  <div className="text-xs text-gray-400">Total Battles</div>
                </div>

                {/* Battles Won */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {userProfile?.totalBattlesWon || 0}
                  </div>
                  <div className="text-xs text-gray-400">Victories</div>
                </div>

                {/* Battles Lost */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {userProfile?.totalBattlesLost || 0}
                  </div>
                  <div className="text-xs text-gray-400">Defeats</div>
                </div>

                {/* Win Rate */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {getWinRate()}%
                  </div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>

                {/* Total Points */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {userProfile?.totalPoints || 0}
                  </div>
                  <div className="text-xs text-gray-400">Total Points</div>
                </div>

                {/* Join Date */}
                <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-[#cd7f32]" />
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {formatJoinDate()}
                  </div>
                  <div className="text-xs text-gray-400">Joined</div>
                </div>
              </div>

              {/* Performance Insights */}

              {userProfile && userProfile?.totalBattlesFought > 0 && (
                <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#cd7f32]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-[#cd7f32]" />
                    <span className="font-bold text-[#cd7f32]">
                      Performance Insights
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {userProfile.totalBattlesFought > 0
                          ? Math.round(
                              userProfile.totalPoints /
                                userProfile.totalBattlesFought
                            )
                          : 0}
                      </div>
                      <div className="text-gray-400">Avg Points/Battle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {getWinRate() >= 70
                          ? "Excellent"
                          : getWinRate() >= 50
                          ? "Good"
                          : getWinRate() >= 30
                          ? "Improving"
                          : "Learning"}
                      </div>
                      <div className="text-gray-400">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {userProfile.totalBattlesFought >= 10
                          ? "Veteran"
                          : userProfile.totalBattlesFought >= 5
                          ? "Experienced"
                          : userProfile.totalBattlesFought >= 1
                          ? "Rookie"
                          : "Newcomer"}
                      </div>
                      <div className="text-gray-400">Battle Rank</div>
                    </div>
                  </div>
                </div>
              )}

              {/* New Player Message */}
              {(!userProfile || userProfile.totalBattlesFought === 0) && (
                <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#cd7f32]/20 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#cd7f32]" />
                    <span className="font-bold text-[#cd7f32]">
                      Ready for Your First Battle?
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Start your warrior journey by creating your first battle
                    room or joining an existing one!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 w-full max-w-4xl">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`group relative overflow-hidden bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-8 transition-all duration-500 transform hover:scale-105 hover:border-[#cd7f32]/50 hover:shadow-lg`}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div
                      className={`p-4 rounded-xl ${
                        action.primary ? "bg-[#cd7f32]/10" : "bg-[#cd7f32]/10"
                      }`}
                    >
                      <Icon className="w-12 h-12 text-[#cd7f32]" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black mb-2 text-[#cd7f32]">
                        {action.label}
                      </h3>
                      <p className={`text-sm text-gray-400 max-w-xs`}>
                        {action.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 opacity-75 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-bold text-[#cd7f32]">
                        Enter Arena
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#cd7f32] transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-[#1a1a1a] border border-[#cd7f32]/20 rounded-lg sm:rounded-xl p-6 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#cd7f32]/10 rounded-lg group-hover:bg-[#cd7f32]/20 transition-colors">
                        <Icon className="w-6 h-6 text-[#cd7f32]" />
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-lg mb-4">
              Ready to prove your worth in the arena?
            </p>
            <div className="flex items-center justify-center gap-2 text-[#cd7f32] animate-pulse">
              <Swords className="w-5 h-5" />
              <span className="font-bold">Choose your destiny above</span>
              <Swords className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Custom CSS for slow spin animation */}
        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </main>
    </>
  );
};

export default BattleArena;
