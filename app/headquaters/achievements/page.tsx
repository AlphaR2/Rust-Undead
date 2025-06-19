"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Crown,
  Sword,
  Shield,
  Star,
  Target,
  Award,
  Medal,
  Gem,
  Lock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Activity,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Flame,
  Sparkles,
  X,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";

interface AchievementsProps {
  onNavigate?: (section: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "warrior" | "battle" | "collection" | "special";
  tier: "bronze" | "silver" | "gold" | "legendary";
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
  reward: {
    type: "experience" | "title" | "badge";
    value: string | number;
  };
}

interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}
const Achievements: React.FC<AchievementsProps> = ({ onNavigate }) => {
  const { isConnected, publicKey, userWarriors, userProfile, networkInfo } =
    useGameData();

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "warrior" | "battle" | "collection" | "special"
  >("all");
  const [selectedTier, setSelectedTier] = useState<
    "all" | "bronze" | "silver" | "gold" | "legendary"
  >("all");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const categories = [
    { id: "all", label: "All Achievements", icon: Trophy },
    { id: "warrior", label: "Warrior Mastery", icon: Sword },
    { id: "battle", label: "Combat Glory", icon: Shield },
    { id: "collection", label: "Collector", icon: Star },
    { id: "special", label: "Special Events", icon: Crown },
  ];

  const tiers = [
    { id: "all", label: "All Tiers", color: "text-gray-400" },
    { id: "bronze", label: "Bronze", color: "text-amber-600" },
    { id: "silver", label: "Silver", color: "text-gray-400" },
    { id: "gold", label: "Gold", color: "text-yellow-400" },
    { id: "legendary", label: "Legendary", color: "text-purple-400" },
  ];

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Generate achievements based on current data
  useEffect(() => {
    generateAchievements();
  }, [userWarriors, userProfile]);

  // Helper function to show notifications
  const showNotification = (message: string, status: "success" | "error") => {
    setNotification({ message, status, show: true });
  };

  // Copy address to clipboard
  const copyToClipboard = async (address: string) => {
    if (!address) {
      showNotification("No address to copy", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      showNotification("Address copied to clipboard!", "success");
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      showNotification("Failed to copy address", "error");
    }
  };

  // Get cluster parameter for explorer links
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

  const generateAchievements = () => {
    const totalWarriors = userWarriors.length;
    const totalBattles = userProfile?.totalBattlesFought || 0;
    const totalWins = userProfile?.totalBattlesWon || 0;
    const totalExperience = userWarriors.reduce(
      (sum, w) => sum + w.experiencePoints,
      0
    );
    const strongestWarrior = Math.max(
      ...userWarriors.map((w) => w.powerLevel),
      0
    );

    const achievementList: Achievement[] = [
      // Warrior Achievements
      {
        id: "first_warrior",
        title: "First Forge",
        description: "Create your first warrior",
        icon: "⚔️",
        category: "warrior",
        tier: "bronze",
        requirement: 1,
        currentProgress: totalWarriors,
        unlocked: totalWarriors >= 1,
        unlockedAt: totalWarriors >= 1 ? Date.now() - 86400000 : undefined,
        reward: { type: "experience", value: 100 },
      },
      {
        id: "warrior_collector",
        title: "Army Builder",
        description: "Forge 5 warriors",
        icon: "🏰",
        category: "warrior",
        tier: "silver",
        requirement: 5,
        currentProgress: totalWarriors,
        unlocked: totalWarriors >= 5,
        reward: { type: "title", value: "Army Commander" },
      },
      {
        id: "legion_master",
        title: "Legion Master",
        description: "Forge 10 warriors",
        icon: "👑",
        category: "warrior",
        tier: "gold",
        requirement: 10,
        currentProgress: totalWarriors,
        unlocked: totalWarriors >= 10,
        reward: { type: "title", value: "Legion Master" },
      },
      {
        id: "undead_overlord",
        title: "Undead Overlord",
        description: "Forge 25 warriors",
        icon: "💀",
        category: "warrior",
        tier: "legendary",
        requirement: 25,
        currentProgress: totalWarriors,
        unlocked: totalWarriors >= 25,
        reward: { type: "title", value: "Undead Overlord" },
      },

      // Battle Achievements
      {
        id: "first_battle",
        title: "First Blood",
        description: "Fight your first battle",
        icon: "⚡",
        category: "battle",
        tier: "bronze",
        requirement: 1,
        currentProgress: totalBattles,
        unlocked: totalBattles >= 1,
        reward: { type: "experience", value: 150 },
      },
      {
        id: "warrior_veteran",
        title: "Battle Veteran",
        description: "Win 10 battles",
        icon: "🛡️",
        category: "battle",
        tier: "silver",
        requirement: 10,
        currentProgress: totalWins,
        unlocked: totalWins >= 10,
        reward: { type: "title", value: "Battle Veteran" },
      },
      {
        id: "champion",
        title: "Arena Champion",
        description: "Win 25 battles",
        icon: "🏆",
        category: "battle",
        tier: "gold",
        requirement: 25,
        currentProgress: totalWins,
        unlocked: totalWins >= 25,
        reward: { type: "title", value: "Arena Champion" },
      },
      {
        id: "undefeated",
        title: "Undefeated Legend",
        description: "Win 50 battles",
        icon: "👑",
        category: "battle",
        tier: "legendary",
        requirement: 50,
        currentProgress: totalWins,
        unlocked: totalWins >= 50,
        reward: { type: "title", value: "Undefeated Legend" },
      },

      // Power & Collection Achievements
      {
        id: "power_seeker",
        title: "Power Seeker",
        description: "Reach power level 5 with any warrior",
        icon: "⚡",
        category: "collection",
        tier: "bronze",
        requirement: 5,
        currentProgress: strongestWarrior,
        unlocked: strongestWarrior >= 5,
        reward: { type: "experience", value: 200 },
      },
      {
        id: "elite_warrior",
        title: "Elite Warrior",
        description: "Reach power level 10 with any warrior",
        icon: "⭐",
        category: "collection",
        tier: "silver",
        requirement: 10,
        currentProgress: strongestWarrior,
        unlocked: strongestWarrior >= 10,
        reward: { type: "title", value: "Elite Trainer" },
      },
      {
        id: "legendary_power",
        title: "Legendary Power",
        description: "Reach power level 20 with any warrior",
        icon: "💎",
        category: "collection",
        tier: "gold",
        requirement: 20,
        currentProgress: strongestWarrior,
        unlocked: strongestWarrior >= 20,
        reward: { type: "title", value: "Legendary Master" },
      },
      {
        id: "experience_master",
        title: "Experience Master",
        description: "Accumulate 10,000 total experience points",
        icon: "📚",
        category: "collection",
        tier: "gold",
        requirement: 10000,
        currentProgress: totalExperience,
        unlocked: totalExperience >= 10000,
        reward: { type: "title", value: "Experience Master" },
      },

      // Special Achievements
      {
        id: "early_adopter",
        title: "Early Adopter",
        description: "Join the Rust Undead Academy",
        icon: "🎯",
        category: "special",
        tier: "bronze",
        requirement: 1,
        currentProgress: isConnected ? 1 : 0,
        unlocked: isConnected,
        unlockedAt: isConnected ? Date.now() - 604800000 : undefined,
        reward: { type: "badge", value: "Early Adopter Badge" },
      },
      {
        id: "blockchain_warrior",
        title: "Blockchain Warrior",
        description: "Complete 10 blockchain transactions",
        icon: "🔗",
        category: "special",
        tier: "silver",
        requirement: 10,
        currentProgress: totalWarriors + totalBattles,
        unlocked: totalWarriors + totalBattles >= 10,
        reward: { type: "title", value: "Blockchain Warrior" },
      },
      {
        id: "solana_master",
        title: "Solana Master",
        description: "Master the Solana blockchain through gameplay",
        icon: "☀️",
        category: "special",
        tier: "legendary",
        requirement: 50,
        currentProgress: totalWarriors + totalBattles,
        unlocked: totalWarriors + totalBattles >= 50,
        reward: { type: "title", value: "Solana Master" },
      },
    ];

    setAchievements(achievementList);
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch =
      selectedCategory === "all" || achievement.category === selectedCategory;
    const tierMatch =
      selectedTier === "all" || achievement.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const getAchievementStats = () => {
    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.unlocked).length;
    const bronze = achievements.filter(
      (a) => a.tier === "bronze" && a.unlocked
    ).length;
    const silver = achievements.filter(
      (a) => a.tier === "silver" && a.unlocked
    ).length;
    const gold = achievements.filter(
      (a) => a.tier === "gold" && a.unlocked
    ).length;
    const legendary = achievements.filter(
      (a) => a.tier === "legendary" && a.unlocked
    ).length;

    return { total, unlocked, bronze, silver, gold, legendary };
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "border-amber-500 bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-300";
      case "silver":
        return "border-gray-400 bg-gradient-to-br from-gray-400/20 to-gray-500/20 text-gray-300";
      case "gold":
        return "border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 text-yellow-300";
      case "legendary":
        return "border-purple-400 bg-gradient-to-br from-purple-400/20 to-purple-500/20 text-purple-300";
      default:
        return "border-gray-600 bg-gradient-to-br from-gray-600/20 to-gray-700/20 text-gray-400";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze":
        return Medal;
      case "silver":
        return Award;
      case "gold":
        return Trophy;
      case "legendary":
        return Crown;
      default:
        return Target;
    }
  };

  const stats = getAchievementStats();

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-lg">
          <div className="text-8xl mb-6">🔒</div>
          <h3 className="text-4xl font-bold text-[#cd7f32] mb-4">
            Wallet Required
          </h3>
          <p className="text-gray-400 text-xl leading-relaxed">
            Connect your Solana wallet to view your achievements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 max-w-sm">
          <div
            className={`p-4 rounded-xl border shadow-2xl backdrop-blur-sm ${
              notification.status === "success"
                ? "bg-green-900/95 border-green-500/50 text-green-100"
                : "bg-red-900/95 border-red-500/50 text-red-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.status === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <button
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
                className="ml-auto text-current hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Stats */}
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#cd7f32] flex items-center gap-6">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
            Achievements
          </h2>
          <p className="text-gray-400 mt-4 text-lg md:text-xl">
            Track your progress and unlock legendary titles
          </p>
        </div>

        {/* Achievement Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl p-6 md:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 shadow-lg hover:shadow-[#cd7f32]/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#cd7f32]" />
              <span className="text-sm md:text-base font-medium text-gray-400">
                Total Progress
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-3">
              {stats.unlocked}/{stats.total}
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-3 border border-[#cd7f32]/20">
              <div
                className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-3 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {((stats.unlocked / stats.total) * 100).toFixed(1)}% Complete
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-amber-600/30 rounded-2xl p-6 md:p-8 hover:border-amber-600/50 transition-all duration-300 shadow-lg hover:shadow-amber-600/20">
            <div className="flex items-center gap-3 mb-4">
              <Medal className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
              <span className="text-sm md:text-base font-medium text-gray-400">
                Bronze
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">
              {stats.bronze}
            </div>
            <div className="text-xs text-amber-500">Basic mastery</div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-gray-400/30 rounded-2xl p-6 md:p-8 hover:border-gray-400/50 transition-all duration-300 shadow-lg hover:shadow-gray-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              <span className="text-sm md:text-base font-medium text-gray-400">
                Silver
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-300 mb-2">
              {stats.silver}
            </div>
            <div className="text-xs text-gray-500">Advanced skills</div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-400/30 rounded-2xl p-6 md:p-8 hover:border-yellow-400/50 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              <span className="text-sm md:text-base font-medium text-gray-400">
                Gold
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              {stats.gold}
            </div>
            <div className="text-xs text-yellow-500">Expert level</div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-purple-400/30 rounded-2xl p-6 md:p-8 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-purple-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <span className="text-sm md:text-base font-medium text-gray-400">
                Legendary
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
              {stats.legendary}
            </div>
            <div className="text-xs text-purple-500">Master status</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <label className="block text-base md:text-lg font-semibold text-gray-300 mb-4">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center justify-center gap-3 px-4 py-4 md:py-5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-[#cd7f32]/20 text-[#cd7f32] border-2 border-[#cd7f32]/50 shadow-lg shadow-[#cd7f32]/20"
                    : "bg-[#1a1a1a] text-gray-400 border-2 border-gray-600 hover:text-[#cd7f32] hover:border-[#cd7f32]/30 hover:bg-[#cd7f32]/10"
                }`}
              >
                <category.icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base md:text-lg font-semibold text-gray-300 mb-4">
            Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as any)}
            className="px-6 py-4 md:py-5 bg-[#1a1a1a] border-2 border-gray-600 rounded-xl text-gray-100 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-base md:text-lg font-medium"
          >
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAchievements.map((achievement) => {
          const TierIcon = getTierIcon(achievement.tier);
          const progressPercentage = Math.min(
            100,
            (achievement.currentProgress / achievement.requirement) * 100
          );

          return (
            <div
              key={achievement.id}
              className={`rounded-2xl p-8 transition-all duration-500 border-2 shadow-xl ${
                achievement.unlocked
                  ? `${getTierColor(
                      achievement.tier
                    )} hover:scale-105 hover:shadow-2xl`
                  : "bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-gray-600 opacity-75"
              }`}
            >
              {/* Achievement Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl md:text-5xl">{achievement.icon}</div>
                  <div>
                    <h3
                      className={`font-bold text-xl md:text-2xl mb-2 ${
                        achievement.unlocked ? "" : "text-gray-400"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <TierIcon className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="text-sm md:text-base capitalize font-semibold">
                        {achievement.tier}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {achievement.unlocked ? (
                    <div className="relative">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                    </div>
                  ) : (
                    <Lock className="w-8 h-8 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-base md:text-lg mb-6 leading-relaxed ${
                  achievement.unlocked ? "text-gray-200" : "text-gray-500"
                }`}
              >
                {achievement.description}
              </p>

              {/* Progress */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-400 font-medium">Progress:</span>
                  <span
                    className={`font-bold ${
                      achievement.unlocked ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {Math.min(
                      achievement.currentProgress,
                      achievement.requirement
                    )}
                    /{achievement.requirement}
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-4 border border-[#cd7f32]/20">
                  <div
                    className={`h-4 rounded-full transition-all duration-700 shadow-sm ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gradient-to-r from-gray-600 to-gray-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {!achievement.unlocked && (
                  <div className="text-sm text-gray-500 text-center">
                    {achievement.requirement - achievement.currentProgress} more
                    needed
                  </div>
                )}
              </div>

              {/* Reward */}
              <div
                className={`text-base p-5 rounded-xl border-2 ${
                  achievement.unlocked
                    ? "bg-green-500/20 border-green-500/40"
                    : "bg-[#2a2a2a] border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Gem className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-semibold text-lg">Reward:</span>
                </div>
                <div
                  className={`font-medium ${
                    achievement.unlocked ? "text-green-300" : "text-gray-400"
                  }`}
                >
                  {achievement.reward.type === "experience" &&
                    `${achievement.reward.value} XP`}
                  {achievement.reward.type === "title" &&
                    `Title: "${achievement.reward.value}"`}
                  {achievement.reward.type === "badge" &&
                    `${achievement.reward.value}`}
                </div>
              </div>

              {/* Unlock Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Unlocked{" "}
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Achievements */}
      {achievements.filter((a) => a.unlocked && a.unlockedAt).length > 0 && (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl p-8 md:p-10 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-[#cd7f32] mb-8 flex items-center gap-4">
            <Activity className="w-7 h-7 md:w-8 md:h-8" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements
              .filter((a) => a.unlocked && a.unlockedAt)
              .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
              .slice(0, 6)
              .map((achievement) => {
                const TierIcon = getTierIcon(achievement.tier);
                return (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-xl border-2 ${getTierColor(
                      achievement.tier
                    )} hover:scale-105 transition-transform duration-300 shadow-lg`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-base md:text-lg">
                          {achievement.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm opacity-80 mt-1">
                          <TierIcon className="w-4 h-4" />
                          <span className="capitalize font-medium">
                            {achievement.tier}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Progress Insights */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl p-8 md:p-10 shadow-lg">
        <h3 className="text-2xl md:text-3xl font-bold text-[#cd7f32] mb-8 flex items-center gap-4">
          <TrendingUp className="w-7 h-7 md:w-8 md:h-8" />
          Progress Insights
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Next Achievement */}
          <div className="space-y-6">
            <h4 className="font-bold text-xl text-white flex items-center gap-3">
              <Target className="w-6 h-6 text-[#cd7f32]" />
              Closest Achievement
            </h4>
            {(() => {
              const nextAchievement = achievements
                .filter((a) => !a.unlocked)
                .sort((a, b) => {
                  const aProgress = a.currentProgress / a.requirement;
                  const bProgress = b.currentProgress / b.requirement;
                  return bProgress - aProgress;
                })[0];

              if (nextAchievement) {
                const progressLeft =
                  nextAchievement.requirement - nextAchievement.currentProgress;
                const progressPercentage =
                  (nextAchievement.currentProgress /
                    nextAchievement.requirement) *
                  100;
                return (
                  <div className="bg-[#2a2a2a] border border-[#cd7f32]/30 rounded-xl p-6 hover:border-[#cd7f32]/50 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{nextAchievement.icon}</span>
                      <div>
                        <div className="font-semibold text-lg text-gray-300">
                          {nextAchievement.title}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">
                          {nextAchievement.tier} tier
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-base text-gray-400">
                        <span className="text-[#cd7f32] font-bold">
                          {progressLeft}
                        </span>{" "}
                        more needed
                      </div>
                      <div className="w-full bg-[#1a1a1a] rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="bg-[#2a2a2a] border border-green-500/30 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <div className="text-lg font-semibold text-green-400">
                    All achievements unlocked!
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    You've mastered everything!
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Category Progress */}
          <div className="space-y-6">
            <h4 className="font-bold text-xl text-white flex items-center gap-3">
              <Star className="w-6 h-6 text-[#cd7f32]" />
              Category Progress
            </h4>
            <div className="space-y-4">
              {categories.slice(1).map((category) => {
                const categoryAchievements = achievements.filter(
                  (a) => a.category === category.id
                );
                const unlockedCount = categoryAchievements.filter(
                  (a) => a.unlocked
                ).length;
                const totalCount = categoryAchievements.length;
                const percentage =
                  totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

                return (
                  <div
                    key={category.id}
                    className="bg-[#2a2a2a] border border-[#cd7f32]/20 rounded-xl p-5 hover:border-[#cd7f32]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5 text-[#cd7f32]" />
                        <span className="text-base font-medium text-gray-300">
                          {category.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-400">
                        {unlockedCount}/{totalCount}
                      </span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-3 border border-[#cd7f32]/20">
                      <div
                        className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-3 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {percentage.toFixed(0)}% Complete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <h4 className="font-bold text-xl text-white flex items-center gap-3">
              <Flame className="w-6 h-6 text-[#cd7f32]" />
              Recommendations
            </h4>
            <div className="space-y-4">
              {userWarriors.length === 0 && (
                <div className="bg-[#2a2a2a] border border-[#cd7f32]/30 rounded-xl p-5 hover:border-[#cd7f32]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Sword className="w-5 h-5 text-[#cd7f32]" />
                    <div className="text-base font-medium text-gray-300">
                      Forge your first warrior
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    Start your journey by creating your first undead warrior
                  </div>
                  <button
                    onClick={() => onNavigate?.("warriors")}
                    className="text-sm text-[#cd7f32] hover:text-[#ff8c42] transition-colors font-semibold flex items-center gap-2"
                  >
                    Go to Warriors <Zap className="w-4 h-4" />
                  </button>
                </div>
              )}

              {userWarriors.length > 0 &&
                (userProfile?.totalBattlesFought || 0) === 0 && (
                  <div className="bg-[#2a2a2a] border border-[#cd7f32]/30 rounded-xl p-5 hover:border-[#cd7f32]/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-[#cd7f32]" />
                      <div className="text-base font-medium text-gray-300">
                        Fight your first battle
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">
                      Enter the arena and test your warrior's might
                    </div>
                    <button
                      onClick={() => onNavigate?.("battle")}
                      className="text-sm text-[#cd7f32] hover:text-[#ff8c42] transition-colors font-semibold flex items-center gap-2"
                    >
                      Enter Arena <Shield className="w-4 h-4" />
                    </button>
                  </div>
                )}

              {userWarriors.length < 5 && (
                <div className="bg-[#2a2a2a] border border-[#cd7f32]/30 rounded-xl p-5 hover:border-[#cd7f32]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-5 h-5 text-[#cd7f32]" />
                    <div className="text-base font-medium text-gray-300">
                      Build your army
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    Create {5 - userWarriors.length} more warriors to unlock
                    Army Builder
                  </div>
                  <button
                    onClick={() => onNavigate?.("warriors")}
                    className="text-sm text-[#cd7f32] hover:text-[#ff8c42] transition-colors font-semibold flex items-center gap-2"
                  >
                    Forge Warriors <Sword className="w-4 h-4" />
                  </button>
                </div>
              )}

              {achievements.filter((a) => !a.unlocked).length === 0 && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <div className="text-base font-medium text-yellow-300">
                      Master Achievement
                    </div>
                  </div>
                  <div className="text-sm text-green-300">
                    Congratulations! You've unlocked all achievements!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl p-8 md:p-10 shadow-lg">
        <h3 className="text-2xl md:text-3xl font-bold text-[#cd7f32] mb-8 flex items-center gap-4">
          <Activity className="w-7 h-7 md:w-8 md:h-8" />
          Blockchain Verification
        </h3>
        <div className="text-center space-y-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              All achievements are verified on the Solana blockchain. Your
              progress is permanent and publicly verifiable.
            </p>
            <div className="inline-flex items-center gap-3 bg-[#2a2a2a] border border-[#cd7f32]/30 rounded-xl px-6 py-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">
                Achievements stored on-chain
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <button
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/address/${publicKey?.toString()}?cluster=${getClusterParam()}`,
                  "_blank"
                )
              }
              className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center gap-3 shadow-lg text-lg"
            >
              <ExternalLink className="w-6 h-6" />
              View on Solana Explorer
            </button>

            {publicKey && (
              <div className="flex items-center gap-4 bg-[#2a2a2a] border border-gray-600 rounded-xl px-6 py-4">
                <span className="text-base text-gray-400 font-medium">
                  Address:
                </span>
                <span className="text-[#cd7f32] font-mono text-base">
                  {publicKey.toString().slice(0, 12)}...
                  {publicKey.toString().slice(-12)}
                </span>
                <button
                  onClick={() => copyToClipboard(publicKey.toString())}
                  className="p-2 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded-lg transition-all duration-200"
                  title={copiedAddress ? "Copied!" : "Copy address"}
                >
                  {copiedAddress ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
