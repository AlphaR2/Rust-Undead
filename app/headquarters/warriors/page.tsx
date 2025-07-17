"use client";
import WarriorCard from "@/app/components/Card";
import {
  VRFStage,
  WARRIOR_CLASS_INFO,
  createWarriorWithVRF,
  generateRandomDNA,
} from "@/hooks/useGameActions";
import { useGameData } from "@/hooks/useGameData";
import { usePDAs, useUndeadProgram } from "@/hooks/useUndeadProgram";
import { ImageRarity, Warrior, WarriorClass } from "@/types/undead";
import { PublicKey } from "@solana/web3.js";
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Crown,
  Diamond,
  ExternalLink,
  Eye,
  Flame,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  Sword,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

const getRarityString = (imageRarity: ImageRarity) => {
  if (typeof imageRarity === "string") {
    return imageRarity;
  }
  if (typeof imageRarity === "object" && imageRarity !== null) {
    const keys = Object.keys(imageRarity);
    if (keys.length > 0) {
      return keys[0].charAt(0).toUpperCase() + keys[0].slice(1);
    }
  }
  return "Common";
};

const Warriors = () => {
  const {
    isConnected,
    publicKey,
    userWarriors,
    loading,
    refreshData,
    networkInfo,
  } = useGameData();

  const program = useUndeadProgram();
  const { configPda, profilePda, achievementsPda, getWarriorPda } =
    usePDAs(publicKey);
  const router = useRouter();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedWarrior, setSelectedWarrior] = useState<Warrior | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Create warrior form state
  const [newWarriorName, setNewWarriorName] = useState<string>("");
  const [newWarriorDNA, setNewWarriorDNA] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<WarriorClass | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [vrfStage, setVrfStage] = useState<VRFStage>({
    stage: "initializing",
    progress: 0,
  });
  const [vrfMessage, setVrfMessage] = useState<string>("");
  const [createdWarrior, setCreatedWarrior] = useState<any>(null);

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  // Copy state
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Initialize DNA on mount
  useEffect(() => {
    if (!newWarriorDNA) {
      setNewWarriorDNA(generateRandomDNA());
    }
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Filter warriors based on search term
  const filteredWarriors = userWarriors.filter((warrior) =>
    warrior.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to show notifications
  const showNotification = (message: string, status: "success" | "error") => {
    setNotification({ message, status, show: true });
  };

  const handleNavigate = (section: string) => {
    router.push(`/headquaters/${section}`);
  };

  // Copy address to clipboard
  const copyToClipboard = async (address: PublicKey | string) => {
    if (!address) {
      showNotification("No address to copy", "error");
      return;
    }

    try {
      const addressStr = address.toString();
      await navigator.clipboard.writeText(addressStr);
      setCopiedAddress(addressStr);
      showNotification("Address copied to clipboard!", "success");
      setTimeout(() => setCopiedAddress(null), 2000);
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

  // Open Solana Explorer
  const openSolanaExplorer = (address: PublicKey) => {
    const cluster = getClusterParam();
    const url = `https://explorer.solana.com/address/${address.toString()}?cluster=${cluster}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Handle warrior creation with VRF
  const handleCreateWarrior = async () => {
    if (
      !program ||
      !publicKey ||
      !configPda ||
      !profilePda ||
      !achievementsPda ||
      !newWarriorName.trim() ||
      !selectedClass
    ) {
      showNotification(
        "Please connect your wallet, enter a warrior name, and select a class",
        "error"
      );
      return;
    }

    if (!newWarriorDNA || newWarriorDNA.length !== 8) {
      showNotification("Invalid DNA sequence. Please try again.", "error");
      return;
    }

    if (!getWarriorPda) {
      showNotification("Unable to generate warrior address", "error");
      return;
    }

    setIsCreating(true);

    try {
      const warriorPda = getWarriorPda(newWarriorName.trim());

      const result = await createWarriorWithVRF({
        program,
        userPublicKey: publicKey,
        name: newWarriorName.trim(),
        dna: newWarriorDNA,
        warriorPda,
        profilePda,
        userAchievementsPda: achievementsPda,
        configPda,
        warriorClass: selectedClass,
        onProgress: (stage, message) => {
          setVrfStage(stage);
          setVrfMessage(message);
        },
      });

      if (result.success) {
        showNotification(`${newWarriorName} forged successfully!`, "success");
        setCreatedWarrior(result.warrior);
        setNewWarriorName("");
        setNewWarriorDNA(generateRandomDNA());
        setSelectedClass(null);

        // Refresh data after 2 seconds
        setTimeout(() => {
          refreshData();
          setShowCreateModal(false);
          setCreatedWarrior(null);
        }, 3000);
      } else {
        showNotification(result.error || "Failed to create warrior", "error");
      }
    } catch (error) {
      showNotification("Unexpected error occurred", "error");
      console.error("Warrior creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Navigate to battle arena
  const handleEnterArena = () => {
    handleNavigate("soooon");
  };

  // Calculate stats for dashboard
  const highestLevel = Math.max(...userWarriors.map((w) => w.level), 0);

  const averageLevel =
    userWarriors.length > 0
      ? Math.round(
          userWarriors.reduce((sum, w) => sum + w.level, 0) /
            userWarriors.length
        )
      : 0;
  const totalExperience = userWarriors.reduce(
    (sum, w) => sum + Number(w.experiencePoints),
    0
  );
  const totalVictories = userWarriors.reduce((sum, w) => sum + w.battlesWon, 0);

  // Show connection required message
  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-lg">
          <div className="relative">
            <div className="text-8xl mb-6 animate-pulse">🔒</div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/20 to-transparent rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent mb-4">
            Wallet Required
          </h3>
          <p className="text-gray-400 text-xl leading-relaxed">
            Connect your Solana wallet to view and manage your warrior army
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-12 w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 max-w-sm">
          <div
            className={`p-4 rounded-xl border shadow-2xl backdrop-blur-sm transform transition-all duration-300 ${
              notification.status === "success"
                ? "bg-green-900/95 border-green-500/50 text-green-100 animate-in slide-in-from-right"
                : "bg-red-900/95 border-red-500/50 text-red-100 animate-in slide-in-from-right"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.status === "success" ? (
                <Check className="w-5 h-5 animate-pulse" />
              ) : (
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              )}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <button
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
                className="ml-auto text-current hover:opacity-70 transition-opacity p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Army Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-[#cd7f32]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#cd7f32]/20 rounded-xl group-hover:bg-[#cd7f32]/30 transition-colors">
                <Users className="w-8 h-8 text-[#cd7f32]" />
              </div>
              <span className="text-base font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                Warriors
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-[#cd7f32] transition-colors">
              {userWarriors.length}
            </div>
            <div className="text-xs text-gray-500">Active in legion</div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-yellow-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <span className="text-base font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                Level
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
              {highestLevel}
            </div>
            <div className="text-xs text-gray-500">Combined power</div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <span className="text-base font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                Victories
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              {totalVictories}
            </div>
            <div className="text-xs text-gray-500">Battles won</div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-base font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                Experience
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {totalExperience.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">XP accumulated</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={refreshData}
          disabled={loading}
          className="group p-4 text-gray-400 hover:text-[#cd7f32] transition-all duration-300 hover:bg-[#cd7f32]/10 rounded-xl border border-gray-600 hover:border-[#cd7f32]/50 hover:shadow-lg hover:shadow-[#cd7f32]/20"
          title="Refresh from blockchain"
        >
          <RefreshCw
            className={`w-6 h-6 transition-transform group-hover:scale-110 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>

        <button
          onClick={() => setShowCreateModal(true)}
          className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl shadow-[#cd7f32]/30 text-base cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
          <span className="relative z-10">Forge New Warrior</span>
        </button>
      </div>

      {/* Enhanced Search Section */}
      <div className="flex justify-center">
        <div className="relative max-w-2xl w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/20 via-[#ff8c42]/20 to-[#cd7f32]/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-2">
            <div className="relative">
              <Search className="w-6 h-6 text-[#cd7f32] absolute left-6 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your warriors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#cd7f32] transition-colors p-1 hover:bg-[#cd7f32]/10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warriors Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[#cd7f32] animate-spin mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/20 to-transparent rounded-full blur-2xl"></div>
            </div>
            <p className="text-gray-400 text-xl animate-pulse">
              Loading your army from blockchain...
            </p>
          </div>
        </div>
      ) : filteredWarriors.length === 0 ? (
        <div className="text-center py-32">
          <div className="relative">
            <div className="text-8xl md:text-9xl mb-8 animate-bounce">⚔️</div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/20 to-transparent rounded-full blur-3xl"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent mb-6">
            {userWarriors.length === 0
              ? "No Warriors Yet"
              : "No Warriors Found"}
          </h3>
          <p className="text-gray-400 text-xl mb-12 max-w-md mx-auto leading-relaxed">
            {userWarriors.length === 0
              ? "Forge your first warrior to start building your undead army!"
              : `Try searching for a different warrior name. You have ${userWarriors.length} warriors total.`}
          </p>
          {userWarriors.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold px-10 py-5 rounded-xl hover:scale-105 transition-transform shadow-2xl text-lg cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Forge Your First Warrior</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWarriors.map((warrior, index) => {
            const totalStats =
              warrior.baseAttack + warrior.baseDefense + warrior.baseKnowledge;
            const winRate =
              warrior.battlesLost > 0
                ? (warrior.battlesWon /
                    (warrior.battlesWon + warrior.battlesLost)) *
                  100
                : warrior.battlesWon > 0
                ? 100
                : 0;
            const rarity = getRarityString(warrior.imageRarity);

            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl overflow-hidden hover:border-[#cd7f32]/70 transition-all duration-500 hover:transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-[#cd7f32]/25"
              >
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Top Action Icons - Only visible on hover */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-end items-start opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                  {/* Action Icons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWarrior(warrior);
                      }}
                      className="p-2 bg-black/60 backdrop-blur-sm border border-[#cd7f32]/30 rounded-full text-[#cd7f32] hover:bg-[#cd7f32]/20 hover:border-[#cd7f32]/70 transition-all duration-300 hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSolanaExplorer(warrior.address);
                      }}
                      className="p-2 bg-black/60 backdrop-blur-sm border border-gray-400/30 rounded-full text-gray-400 hover:bg-gray-400/20 hover:border-gray-400/70 hover:text-white transition-all duration-300 hover:scale-110"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Stats Overlay - Only visible on hover */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="space-y-3">
                    {/* Warrior Name */}
                    <h3 className="text-lg font-bold text-white truncate">
                      {warrior.name}
                    </h3>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-[#cd7f32] font-bold">
                          {warrior.baseAttack}
                        </div>
                        <div className="text-gray-400">Atk</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">
                          {warrior.baseDefense}
                        </div>
                        <div className="text-gray-400">Def</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold">
                          {warrior.baseKnowledge}
                        </div>
                        <div className="text-gray-400">Knw</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">
                          {warrior.level}
                        </div>
                        <div className="text-gray-400">Lvl</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterArena();
                      }}
                      className="w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-semibold py-2.5 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                      <Shield className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Enter Arena</span>
                    </button>
                  </div>
                </div>

                {/* Level Badge - Always visible */}
                <div
                  className={
                    "absolute top-4 left-1/2 transform -translate-x-1/2 z-15 px-3 py-1 bg-black/60 backdrop-blur-sm border border-[#cd7f32]/30 rounded-full"
                  }
                >
                  <div className="flex items-center gap-1">
                    <Diamond className="w-3 h-3 text-[#cd7f32]" />
                    <span className="text-xs font-bold text-[#cd7f32]">
                      {rarity}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <WarriorCard
                    warrior={{
                      name: warrior.name,
                      baseAttack: warrior.baseAttack,
                      baseDefense: warrior.baseDefense,
                      baseKnowledge: warrior.baseKnowledge,
                      imageUri: warrior.imageUri,
                      imageRarity: warrior.imageRarity,
                      warriorClass: warrior.warriorClass,
                      owner: warrior.owner,
                      createdAt: warrior.createdAt,
                      currentHp: warrior.currentHp,
                      maxHp: warrior.maxHp,
                      battlesWon: warrior.battlesWon,
                      battlesLost: warrior.battlesLost,
                      experiencePoints: warrior.experiencePoints,
                      level: warrior.level,
                      dna: warrior.dna,
                      lastBattleAt: warrior.lastBattleAt,
                      cooldownExpiresAt: warrior.cooldownExpiresAt,
                      imageIndex: warrior.imageIndex,
                      isOnCooldown: warrior.isOnCooldown,
                      address: warrior.address,
                    }}
                    selectedClass={warrior.warriorClass}
                    warriorName={warrior.name}
                  />
                </div>

                {/* Cooldown Indicator - If warrior is on cooldown */}
                {warrior.isOnCooldown && (
                  <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="bg-red-900/80 border border-red-500/50 rounded-xl p-4 text-center">
                      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-red-300 font-bold">On Cooldown</div>
                      <div className="text-red-400 text-sm">
                        Recovering from battle
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Create Warrior Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent flex items-center gap-3">
                  <Zap className="w-8 h-8 text-[#cd7f32]" />
                  Forge New Warrior
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl group"
                >
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Form */}
                <div className="space-y-6">
                  {/* Class Selection */}
                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-[#cd7f32]" />
                      Choose Warrior Class:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(WARRIOR_CLASS_INFO).map(
                        ([classKey, classInfo]) => {
                          const warriorClass = classKey as WarriorClass;
                          const isSelected = selectedClass === warriorClass;

                          return (
                            <button
                              key={classKey}
                              onClick={() => setSelectedClass(warriorClass)}
                              className={`group p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                                isSelected
                                  ? "border-[#cd7f32] bg-[#cd7f32]/10 shadow-lg shadow-[#cd7f32]/20"
                                  : "border-gray-600/30 bg-[#1a1a1a] hover:border-[#cd7f32]/50 hover:bg-[#cd7f32]/5"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/10 to-transparent"></div>
                              )}
                              <div className="relative">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl group-hover:scale-110 transition-transform">
                                    {classInfo.icon}
                                  </span>
                                  <span
                                    className={`font-bold transition-colors ${
                                      isSelected
                                        ? "text-[#cd7f32]"
                                        : "text-gray-300 group-hover:text-[#cd7f32]"
                                    }`}
                                  >
                                    {classInfo.title}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {classInfo.description}
                                </p>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <Sword className="w-5 h-5 text-[#cd7f32]" />
                      Warrior Name:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newWarriorName}
                        onChange={(e) => setNewWarriorName(e.target.value)}
                        placeholder="Enter warrior name..."
                        maxLength={32}
                        className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-lg"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        {newWarriorName.length}/32
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#cd7f32]" />
                      DNA Code:
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newWarriorDNA}
                        onChange={(e) =>
                          setNewWarriorDNA(
                            e.target.value.slice(0, 8).toUpperCase()
                          )
                        }
                        placeholder="DNA CODE"
                        maxLength={8}
                        className="flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 font-mono transition-all text-lg tracking-wider"
                      />
                      <button
                        onClick={() => setNewWarriorDNA(generateRandomDNA())}
                        className="group px-5 py-4 bg-[#cd7f32]/20 border border-[#cd7f32]/50 rounded-xl text-[#cd7f32] hover:bg-[#cd7f32]/30 transition-all text-xl cursor-pointer"
                        title="Generate random DNA"
                      >
                        <span className="group-hover:rotate-180 transition-transform duration-300 inline-block">
                          🎲
                        </span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      8 character hex code (affects visual appearance and stats)
                    </p>
                  </div>

                  {/* VRF Progress Display */}
                  {isCreating && (
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-xl p-6">
                      <div className="text-center space-y-4">
                        <div className="text-lg font-bold text-[#cd7f32] flex items-center justify-center gap-2">
                          <Flame className="w-6 h-6 animate-pulse" />
                          Forging Your Warrior
                        </div>

                        <div className="w-full bg-[#0f0f0f] h-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] transition-all duration-500 ease-out"
                            style={{ width: `${vrfStage.progress}%` }}
                          />
                        </div>

                        <div className="text-sm text-gray-300">
                          {vrfMessage}
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[#cd7f32]" />
                          <span className="text-sm text-gray-400">
                            {vrfStage.stage === "polling"
                              ? "Waiting for VRF..."
                              : "Processing..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 border-2 border-gray-600 text-gray-300 font-semibold py-4 rounded-xl hover:border-gray-500 hover:bg-gray-600/10 transition-all text-lg cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleCreateWarrior}
                      disabled={
                        !newWarriorName.trim() ||
                        !newWarriorDNA ||
                        newWarriorDNA.length !== 8 ||
                        !selectedClass ||
                        isCreating
                      }
                      className="group flex-1 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        {isCreating ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Forging...
                          </>
                        ) : (
                          <>
                            <Flame className="w-6 h-6" />
                            Forge Warrior
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right: Preview */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                    <h4 className="relative text-2xl font-bold text-[#cd7f32] mb-6 text-center flex items-center justify-center gap-3">
                      <Star className="w-6 h-6 animate-pulse" />
                      Warrior Preview
                    </h4>

                    {selectedClass && newWarriorName && newWarriorDNA ? (
                      <div className="relative flex justify-center"></div>
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        <div className="text-6xl mb-4 animate-pulse">⚔️</div>
                        <p>Fill in details to see preview</p>
                      </div>
                    )}
                  </div>

                  {createdWarrior && (
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/50 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                      <div className="relative text-center space-y-4">
                        <div className="text-lg font-bold text-green-300 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          Warrior Successfully Forged!
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                            <div className="text-red-400 font-bold text-lg">
                              ⚔️ {createdWarrior.baseAttack}
                            </div>
                            <div className="text-gray-400">Attack</div>
                          </div>
                          <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                            <div className="text-blue-400 font-bold text-lg">
                              🛡️ {createdWarrior.baseDefense}
                            </div>
                            <div className="text-gray-400">Defense</div>
                          </div>
                          <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                            <div className="text-purple-400 font-bold text-lg">
                              🧠 {createdWarrior.baseKnowledge}
                            </div>
                            <div className="text-gray-400">Knowledge</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-300 bg-green-500/20 rounded-lg p-2">
                          🎨 Rarity:{" "}
                          {getRarityString(createdWarrior.imageRarity)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Warrior Details Modal */}
      {selectedWarrior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent flex items-center gap-3">
                  <Target className="w-8 h-8 text-[#cd7f32]" />
                  Warrior Details
                </h3>
                <button
                  onClick={() => setSelectedWarrior(null)}
                  className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl group"
                >
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Warrior Card */}
                <div className="flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <WarriorCard
                      warrior={{
                        name: selectedWarrior.name,
                        baseAttack: selectedWarrior.baseAttack,
                        baseDefense: selectedWarrior.baseDefense,
                        baseKnowledge: selectedWarrior.baseKnowledge,
                        imageUri: selectedWarrior.imageUri,
                        imageRarity: selectedWarrior.imageRarity,
                        warriorClass: selectedWarrior.warriorClass,
                        owner: selectedWarrior.owner,
                        createdAt: selectedWarrior.createdAt,
                        currentHp: selectedWarrior.currentHp,
                        maxHp: selectedWarrior.maxHp,
                        battlesWon: selectedWarrior.battlesWon,
                        battlesLost: selectedWarrior.battlesLost,
                        experiencePoints: selectedWarrior.experiencePoints,
                        level: selectedWarrior.level,
                        dna: selectedWarrior.dna,
                        lastBattleAt: selectedWarrior.lastBattleAt,
                        cooldownExpiresAt: selectedWarrior.cooldownExpiresAt,
                        imageIndex: selectedWarrior.imageIndex,
                        isOnCooldown: selectedWarrior.isOnCooldown,
                        address: selectedWarrior.address,
                      }}
                      selectedClass={selectedWarrior.warriorClass}
                      warriorName={selectedWarrior.name}
                    />
                  </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  {/* Combat Statistics */}
                  <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                    <h5 className="relative text-xl font-bold text-[#cd7f32] mb-4 flex items-center gap-3">
                      <Trophy className="w-6 h-6" />
                      Combat Statistics
                    </h5>
                    <div className="relative grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {selectedWarrior.battlesWon}
                        </div>
                        <div className="text-sm text-gray-400">Battles Won</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {selectedWarrior.battlesWon +
                            selectedWarrior.battlesLost}
                        </div>
                        <div className="text-sm text-gray-400">
                          Total Battles
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Information */}
                  <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                    <h5 className="relative text-xl font-bold text-[#cd7f32] mb-4 flex items-center gap-3">
                      <Activity className="w-6 h-6" />
                      Blockchain Data
                    </h5>
                    <div className="relative space-y-4">
                      <div className="flex justify-between items-center p-3 bg-[#2a2a2a]/50 rounded-lg">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-white font-mono text-lg font-bold">
                          {selectedWarrior.level}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#2a2a2a]/50 rounded-lg">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white font-mono text-lg font-bold">
                          {Number(
                            selectedWarrior.experiencePoints
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#2a2a2a]/50 rounded-lg">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white font-mono">
                          {new Date(
                            selectedWarrior.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#2a2a2a]/50 rounded-lg">
                        <span className="text-gray-400">Address:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">
                            {selectedWarrior.address.toString().slice(0, 8)}...
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(selectedWarrior.address)
                            }
                            className="p-1 text-gray-400 hover:text-[#cd7f32] transition-colors hover:bg-[#cd7f32]/10 rounded"
                          >
                            {copiedAddress ===
                            selectedWarrior.address.toString() ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleEnterArena}
                      className="group w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 text-lg shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <Shield className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">Enter Arena</span>
                    </button>

                    <button
                      onClick={() =>
                        openSolanaExplorer(selectedWarrior.address)
                      }
                      className="w-full bg-[#2a2a2a] border-2 border-gray-600 text-gray-400 font-semibold py-4 rounded-xl hover:text-[#cd7f32] hover:border-[#cd7f32]/50 hover:bg-[#cd7f32]/5 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      <ExternalLink className="w-6 h-6" />
                      View on Solana Explorer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quick Arena Access CTA */}
      {userWarriors.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#cd7f32]/15 via-[#ff8c42]/15 to-[#cd7f32]/15 border-2 border-[#cd7f32]/40 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cd7f32]/10 to-transparent rounded-full blur-3xl"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#cd7f32] flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Ready for Battle?
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Your warriors await your command in the arena. Choose your
                champion and fight for glory, honor, and rewards!
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-3 bg-[#cd7f32]/10 px-4 py-2 rounded-full border border-[#cd7f32]/30">
                  <Sword className="w-4 h-4 text-[#cd7f32]" />
                  <span className="text-gray-300 font-semibold">
                    {userWarriors.length} Warriors Ready
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                  <Trophy className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 font-semibold">
                    {totalVictories} Total Victories
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/30">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 font-semibold">
                    Level {averageLevel} Average
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEnterArena}
              className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl hover:scale-105 transition-transform flex items-center gap-4 shadow-2xl shadow-[#cd7f32]/30 text-base md:text-lg cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <Shield className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
              <span className="relative z-10">Enter Battle Arena</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warriors;
