"use client";
import React, { useState } from "react";
import {
  Sword,
  Trophy,
  Crown,
  TrendingUp,
  Plus,
  Shield,
  ExternalLink,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { audioManager } from "@/utils/audioManager";
import { PublicKey } from "@solana/web3.js";


interface DashboardPageProps {
  onNavigate: (section: string) => void;
  selectedPath?: "apprentice" | "warrior" | "master";
}

interface Activity {
  type: "warrior_created" | "battle_fought";
  timestamp: number;
  data: {
    name?: string;
    dna?: string;
    result?: "victory" | "defeat";
    opponent?: string;
  };
  icon: string;
}

interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}

interface ProgressMetric {
  label: string;
  current: number;
  max: number;
  description?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  selectedPath = "apprentice",
}) => {
  const { gameConfig, userProfile, userWarriors, publicKey, networkInfo } =
    useGameData();

  const [showActivityDetails, setShowActivityDetails] =
    useState<boolean>(false);

  // Helper function to get the strongest warrior
  const getStrongestWarrior = () => {
    if (!userWarriors.length) return null;
    return userWarriors.reduce((strongest, warrior) =>
      warrior.powerLevel > strongest.powerLevel ? warrior : strongest
    );
  };

  // Helper function to get recent activities
  const getRecentActivity = (): Activity[] => {
    const activities: Activity[] = [];

    // Add warrior creation activities
    userWarriors.forEach((warrior) => {
      activities.push({
        type: "warrior_created",
        timestamp: warrior.createdAt * 1000,
        data: {
          name: warrior.name,
          dna: warrior.dna,
        },
        icon: "⚔️",
      });
    });

    // Add battle activities (when implemented)
    if (userProfile?.totalBattlesFought && userProfile.totalBattlesFought > 0) {
      activities.push({
        type: "battle_fought",
        timestamp: Date.now() - 3600000,
        data: {
          result: "victory",
          opponent: "Shadow Knight",
        },
        icon: "🏆",
      });
    }

    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Helper function to determine cluster based on network
  const getClusterParam = (): string => {
    if (!networkInfo) return "devnet";

    switch (networkInfo.name.toLowerCase()) {
      case "mainnet":
        return "mainnet-beta";
      case "testnet":
        return "testnet";
      case "devnet":
      default:
        return "devnet";
    }
  };

  // Helper function to open Solana Explorer
  const openSolanaExplorer = async (
    address?: PublicKey | null
  ): Promise<void> => {
    if (!address) return;

    try {
      await audioManager.playSound("click");
      const cluster = getClusterParam();
      const url = `https://explorer.solana.com/address/${address.toString()}?cluster=${cluster}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening Solana Explorer:", error);
    }
  };

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: "forge-warrior",
      label: "Forge New Warrior",
      onClick: () => {
        audioManager.playSound("forge");
        onNavigate("warriors");
      },
      icon: Plus,
      primary: true,
    },
    {
      id: "battle-arena",
      label: "Enter Battle Arena",
      onClick: () => {
        audioManager.playSound("battle");
        onNavigate("battle");
      },
      icon: Shield,
    },
    {
      id: "achievements",
      label: "View Achievements",
      onClick: () => {
        audioManager.playSound("click");
        onNavigate("achievements");
      },
      icon: Trophy,
    },
    {
      id: "explore-solana",
      label: "Explore Solana",
      onClick: () => openSolanaExplorer(publicKey),
      icon: ExternalLink,
    },
  ];

  // Progress metrics configuration
  const progressMetrics: ProgressMetric[] = [
    {
      label: "Rust Concepts",
      current: Math.min(20, userWarriors.length * 4),
      max: 20,
      description: "Programming concepts learned",
    },
    {
      label: "Blockchain Transactions",
      current: userWarriors.length + (userProfile?.totalBattlesFought || 0),
      max: 10,
      description: "On-chain interactions",
    },
    {
      label: "Smart Contract Interactions",
      current: userWarriors.length,
      max: 5,
      description: "Program calls made",
    },
  ];

  // Helper function to get next milestone message
  const getNextMilestone = (): string => {
    if (userWarriors.length === 0) {
      return "Forge your first warrior to begin your journey!";
    }
    if (userWarriors.length < 3) {
      return "Create 3 warriors to unlock Battle Arena";
    }
    if ((userProfile?.totalBattlesFought || 0) === 0) {
      return "Fight your first battle to earn experience";
    }
    return "Continue forging and battling to master Rust & Solana";
  };

  // Helper function to get activity description
  const getActivityDescription = (activity: Activity): string => {
    switch (activity.type) {
      case "warrior_created":
        return `Forged ${activity.data.name || "Unknown Warrior"}`;
      case "battle_fought":
        return `Battle ${activity.data.result || "unknown"} vs ${
          activity.data.opponent || "Unknown"
        }`;
      default:
        return "Unknown activity";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Warriors Stat */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
              <Sword className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
            </div>
            <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
              Warriors
            </h3>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {userWarriors.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Total forged</div>
        </div>

        {/* Victories Stat */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
            </div>
            <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
              Victories
            </h3>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {userProfile?.totalBattlesWon || 0}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Battles won</div>
        </div>

        {/* Power Stat */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
            </div>
            <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
              Power
            </h3>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {getStrongestWarrior()?.powerLevel || 0}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Max level</div>
        </div>

        {/* Progress Stat */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#cd7f32]/50 transition-all duration-300">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="p-1.5 sm:p-2 bg-[#cd7f32]/10 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#cd7f32]" />
            </div>
            <h3 className="font-bold text-[#cd7f32] text-sm sm:text-base">
              Progress
            </h3>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {Math.min(
              100,
              userWarriors.length * 20 +
                (userProfile?.totalBattlesWon || 0) * 10
            )}
            %
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Academy</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#cd7f32] mb-4 lg:mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`font-bold p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  action.primary
                    ? "bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black hover:shadow-lg hover:shadow-[#cd7f32]/25"
                    : "bg-[#1a1a1a] border border-[#cd7f32]/50 hover:bg-[#cd7f32]/10 hover:border-[#cd7f32] text-[#cd7f32]"
                }`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  <span className="text-sm sm:text-base lg:text-lg">
                    {action.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#cd7f32]">
              Recent Activity
            </h3>
            <button
              onClick={() => setShowActivityDetails(!showActivityDetails)}
              className="text-[#cd7f32] hover:text-[#ff8c42] transition-colors p-2 rounded-lg hover:bg-[#cd7f32]/10"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  showActivityDetails ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {getRecentActivity().length > 0 ? (
              getRecentActivity().map((activity, index) => (
                <div
                  key={`${activity.type}-${activity.timestamp}-${index}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a]/80 transition-colors"
                >
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200 truncate">
                      {getActivityDescription(activity)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-400">
                <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-base sm:text-lg font-medium mb-2">
                  No recent activity
                </p>
                <p className="text-sm">
                  Forge your first warrior to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-[#cd7f32] mb-4 lg:mb-6">
            Learning Progress
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {progressMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-2 sm:mb-3">
                  <span className="text-gray-300 font-medium">
                    {metric.label}
                  </span>
                  <span className="text-[#cd7f32] font-bold">
                    {metric.current}/{metric.max}
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-2 sm:h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (metric.current / metric.max) * 100
                      )}%`,
                    }}
                  />
                </div>
                {metric.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-[#2a2a2a] rounded-lg border border-[#cd7f32]/20">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#cd7f32]" />
              <span className="font-bold text-[#cd7f32] text-sm sm:text-base">
                Next Milestone
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {getNextMilestone()}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Contract Stats */}
      <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-[#cd7f32] mb-6 lg:mb-8 text-center">
          Smart Contract Stats
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="text-center p-4 sm:p-6 bg-[#2a2a2a] rounded-lg">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cd7f32] mb-2">
              {userWarriors.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              On-chain Accounts Created
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-[#2a2a2a] rounded-lg">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cd7f32] mb-2">
              {userWarriors.length + (userProfile?.totalBattlesFought || 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              Total Program Interactions
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-[#2a2a2a] rounded-lg">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cd7f32] mb-2">
              {gameConfig?.totalWarriorsCreated || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              Global Warriors Forged
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 flex justify-center">
          <button
            onClick={() => openSolanaExplorer(publicKey)}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[#cd7f32]/10 border border-[#cd7f32]/50 text-[#cd7f32] hover:bg-[#cd7f32]/20 hover:border-[#cd7f32] rounded-lg transition-all duration-300 font-medium text-sm sm:text-base"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View All Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
