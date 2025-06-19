"use client";
import React, { useState, useEffect } from "react";
import {
  Sword,
  Plus,
  ExternalLink,
  Zap,
  Crown,
  Trophy,
  Activity,
  Search,
  RefreshCw,
  Eye,
  X,
  Loader2,
  Shield,
  Copy,
  Check,
  AlertTriangle,
  Star,
  Flame,
  Target,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { useUndeadProgram, usePDAs } from "@/hooks/useUndeadProgram";
import { createWarrior, generateRandomDNA } from "@/hooks/useGameActions";
import { PublicKey } from "@solana/web3.js";
import { Warrior } from "@/types/undead";

interface MyWarriorsProps {
  onBattleSelect?: (warrior: any) => void;
  onNavigate?: (section: string) => void;
}

interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

export const MyWarriors: React.FC<MyWarriorsProps> = ({ onNavigate }) => {
  const {
    isConnected,
    publicKey,
    userWarriors,
    loading,
    refreshData,
    networkInfo,
  } = useGameData();

  const program = useUndeadProgram();
  const { configPda, profilePda, getWarriorPda } = usePDAs(publicKey);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedWarrior, setSelectedWarrior] = useState<Warrior | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created");
  const [filterBy, setFilterBy] = useState<string>("all");

  // Create warrior form state
  const [newWarriorName, setNewWarriorName] = useState<string>("");
  const [newWarriorDNA, setNewWarriorDNA] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedWarriorImage, setSelectedWarriorImage] = useState<string>("");

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  // Copy state
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Warrior image options
  const warriorImages = [
    "/men_warrior.png",
    "/women_warrior.png",
    "/warrior_landing.png",
  ];

  // Initialize DNA and image on mount
  useEffect(() => {
    if (!newWarriorDNA) {
      setNewWarriorDNA(generateRandomDNA());
    }
    const randomImage =
      warriorImages[Math.floor(Math.random() * warriorImages.length)];
    setSelectedWarriorImage(randomImage);
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

  // Helper function to show notifications
  const showNotification = (message: string, status: "success" | "error") => {
    setNotification({ message, status, show: true });
  };

  // Get consistent warrior image based on DNA
  const getWarriorImage = (dna: string) => {
    if (!dna) return warriorImages[0];
    const imageIndex = parseInt(dna[0], 16) % warriorImages.length;
    return warriorImages[imageIndex];
  };

  // Randomly select a new warrior image
  const selectRandomWarriorImage = () => {
    const randomImage =
      warriorImages[Math.floor(Math.random() * warriorImages.length)];
    setSelectedWarriorImage(randomImage);
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

  // Render warrior image component
  const renderWarriorImage = (warrior: any, isPreview = false) => {
    const imageUrl = isPreview
      ? selectedWarriorImage
      : getWarriorImage(warrior.dna);
    const dna = warrior.dna || "XXXXXXXX";

    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#cd7f32]/30 group-hover:border-[#cd7f32]/60 transition-all duration-500 shadow-lg">
          <img
            src={imageUrl}
            alt={`${warrior.name || "Warrior"} Avatar`}
            className={`${
              isPreview ? "w-28 h-28" : "w-full h-56"
            } object-cover bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] group-hover:scale-110 transition-transform duration-500`}
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml;base64," +
                btoa(`
                <svg width="224" height="224" xmlns="http://www.w3.org/2000/svg">
                  <rect width="224" height="224" fill="#1a1a1a"/>
                  <text x="112" y="112" text-anchor="middle" dominant-baseline="middle" fill="#cd7f32" font-size="80">⚔️</text>
                </svg>
              `);
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* DNA overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
            <div className="text-xs text-[#cd7f32] font-mono text-center font-semibold tracking-wider">
              DNA: {dna}
            </div>
          </div>

          {/* Power level badge */}
          {!isPreview && warrior.powerLevel && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ⚡ {warrior.powerLevel}
            </div>
          )}
        </div>

        {isPreview && (
          <button
            onClick={selectRandomWarriorImage}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] rounded-full flex items-center justify-center text-black text-sm transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
            title="Change warrior appearance cursor-pointer"
          >
            🎲
          </button>
        )}
      </div>
    );
  };

  // Handle warrior creation
  const handleCreateWarrior = async () => {
    if (
      !program ||
      !publicKey ||
      !configPda ||
      !profilePda ||
      !newWarriorName.trim()
    ) {
      showNotification(
        "Please connect your wallet and enter a warrior name",
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

      const result = await createWarrior({
        program,
        userPublicKey: publicKey,
        name: newWarriorName.trim(),
        dna: newWarriorDNA,
        warriorPda,
        profilePda,
        configPda,
      });

      if (result.success) {
        showNotification(`${newWarriorName} forged successfully!`, "success");
        setNewWarriorName("");
        setNewWarriorDNA(generateRandomDNA());
        selectRandomWarriorImage();

        // Refresh data after 2 seconds
        setTimeout(() => {
          refreshData();
          setShowCreateModal(false);
        }, 2000);
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

  // Filter and sort warriors
  const filteredAndSortedWarriors = () => {
    let filtered = userWarriors.filter((warrior) =>
      warrior.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    switch (filterBy) {
      case "strong":
        filtered = filtered.filter((warrior) => warrior.powerLevel >= 5);
        break;
      case "veteran":
        filtered = filtered.filter((warrior) => warrior.battlesFought >= 5);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "power":
        return filtered.sort((a, b) => b.powerLevel - a.powerLevel);
      case "battles":
        return filtered.sort((a, b) => b.battleWins - a.battleWins);
      case "created":
      default:
        return filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  // Get warrior rank based on stats
  const getWarriorRank = (warrior: any) => {
    if (warrior.powerLevel >= 20)
      return {
        rank: "Legendary",
        color: "text-purple-400",
        icon: "👑",
        bgColor: "bg-gradient-to-r from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-500/50",
      };
    if (warrior.powerLevel >= 10)
      return {
        rank: "Elite",
        color: "text-yellow-400",
        icon: "⭐",
        bgColor: "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20",
        borderColor: "border-yellow-500/50",
      };
    if (warrior.powerLevel >= 5)
      return {
        rank: "Veteran",
        color: "text-blue-400",
        icon: "🛡️",
        bgColor: "bg-gradient-to-r from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-500/50",
      };
    if (warrior.battleWins >= 5)
      return {
        rank: "Warrior",
        color: "text-green-400",
        icon: "⚔️",
        bgColor: "bg-gradient-to-r from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/50",
      };
    return {
      rank: "Recruit",
      color: "text-gray-400",
      icon: "🔰",
      bgColor: "bg-gradient-to-r from-gray-500/20 to-gray-600/20",
      borderColor: "border-gray-500/50",
    };
  };

  // Navigate to battle arena
  const handleEnterArena = () => {
    if (onNavigate) {
      onNavigate("battle");
    }
  };

  // Show connection required message
  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-lg">
          <div className="text-8xl mb-6">🔒</div>
          <h3 className="text-4xl font-bold text-[#cd7f32] mb-4">
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <p className="text-gray-400 text-lg md:text-xl">
            Your Immortal Legion •{" "}
            <span className="text-[#cd7f32] font-semibold">
              {userWarriors.length}
            </span>{" "}
            warriors strong
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-4 text-gray-400 hover:text-[#cd7f32] transition-all duration-300 hover:bg-[#cd7f32]/10 rounded-xl border border-gray-600 hover:border-[#cd7f32]/50"
            title="Refresh from blockchain"
          >
            <RefreshCw
              className={`w-6 h-6 md:w-7 md:h-7 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 shadow-2xl shadow-[#cd7f32]/30 text-base md:text-lg cursor-pointer"
          >
            <Plus className="w-6 h-6 md:w-7 md:h-7" />
            Forge New Warrior
          </button>
        </div>
      </div>

      {/* Army Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 md:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-[#cd7f32]/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#cd7f32]/20 rounded-xl">
              <Sword className="w-6 h-6 md:w-8 md:h-8 text-[#cd7f32]" />
            </div>
            <span className="text-sm md:text-base font-medium text-gray-400">
              Total Warriors
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            {userWarriors.length}
          </div>
          <div className="text-xs text-gray-500">Active in legion</div>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 md:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-yellow-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
            <span className="text-sm md:text-base font-medium text-gray-400">
              Highest Power
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            {Math.max(...userWarriors.map((w) => w.powerLevel), 0)}
          </div>
          <div className="text-xs text-gray-500">Maximum strength</div>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 md:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-green-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
            </div>
            <span className="text-sm md:text-base font-medium text-gray-400">
              Total Victories
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            {userWarriors.reduce((sum, w) => sum + w.battleWins, 0)}
          </div>
          <div className="text-xs text-gray-500">Battles won</div>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#cd7f32]/30 rounded-2xl p-6 md:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-blue-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <span className="text-sm md:text-base font-medium text-gray-400">
              Total Experience
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            {userWarriors.reduce((sum, w) => sum + w.experiencePoints, 0)}
          </div>
          <div className="text-xs text-gray-500">XP accumulated</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search warriors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 md:py-5 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-base md:text-lg"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 md:px-8 py-4 md:py-5 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-base md:text-lg"
          >
            <option value="created">Sort by Created</option>
            <option value="power">Sort by Power</option>
            <option value="battles">Sort by Battles</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-6 md:px-8 py-4 md:py-5 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-base md:text-lg"
          >
            <option value="all">All Warriors</option>
            <option value="strong">Strong (Power 5+)</option>
            <option value="veteran">Veterans (5+ Battles)</option>
          </select>
        </div>
      </div>

      {/* Warriors Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-6">
            <Loader2 className="w-16 h-16 text-[#cd7f32] animate-spin mx-auto" />
            <p className="text-gray-400 text-xl">
              Loading your army from blockchain...
            </p>
          </div>
        </div>
      ) : filteredAndSortedWarriors().length === 0 ? (
        <div className="text-center py-32">
          <div className="text-8xl md:text-9xl mb-8">⚔️</div>
          <h3 className="text-3xl md:text-4xl font-bold text-[#cd7f32] mb-6">
            {userWarriors.length === 0
              ? "No Warriors Yet"
              : "No Warriors Found"}
          </h3>
          <p className="text-gray-400 text-xl mb-12 max-w-md mx-auto leading-relaxed">
            {userWarriors.length === 0
              ? "Forge your first warrior to start building your undead army!"
              : "Try adjusting your search or filter criteria"}
          </p>
          {userWarriors.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold px-10 py-5 rounded-xl hover:scale-105 transition-transform shadow-2xl text-lg cursor-pointer"
            >
              Forge Your First Warrior
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-42">
          {filteredAndSortedWarriors().map((warrior, index) => {
            // const rank = getWarriorRank(warrior);

            return (
              <div
                key={index}
                className="bg-gradient-to-br w-64 from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl overflow-hidden hover:border-[#cd7f32]/70 transition-all duration-500 hover:transform hover:scale-105 group shadow-xl hover:shadow-2xl hover:shadow-[#cd7f32]/25"
              >
                {/* Warrior Image */}
                <div className="relative">{renderWarriorImage(warrior)}</div>

                {/* Warrior Info */}
                <div className="p-6 md:p-7 space-y-5">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-[#cd7f32] mb-2 truncate">
                      {warrior.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      DNA: {warrior.dna}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#cd7f32]/20">
                      <span className="text-gray-400 block mb-1">
                        Power Level
                      </span>
                      <span className="text-white font-bold text-xl">
                        {warrior.powerLevel}
                      </span>
                    </div>
                    <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#cd7f32]/20">
                      <span className="text-gray-400 block mb-1">
                        Experience
                      </span>
                      <span className="text-white font-bold text-xl">
                        {warrior.experiencePoints}
                      </span>
                    </div>
                    <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#cd7f32]/20">
                      <span className="text-gray-400 block mb-1">Battles</span>
                      <span className="text-white font-bold text-lg">
                        {warrior.battleWins}/{warrior.battlesFought}
                      </span>
                    </div>
                    <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#cd7f32]/20">
                      <span className="text-gray-400 block mb-1">Created</span>
                      <span className="text-white font-bold text-lg">
                        {new Date(warrior.createdAt * 1000).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Win Rate Bar */}
                  {warrior.battlesFought > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium">
                          Win Rate
                        </span>
                        <span className="text-green-400 font-bold">
                          {(
                            (warrior.battleWins / warrior.battlesFought) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-[#0f0f0f] rounded-full h-3 border border-[#cd7f32]/20">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                          style={{
                            width: `${
                              (warrior.battleWins / warrior.battlesFought) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => setSelectedWarrior(warrior)}
                      className="flex-1 bg-[#cd7f32]/20 border border-[#cd7f32]/50 text-[#cd7f32] font-semibold py-3.5 px-4 rounded-xl hover:bg-[#cd7f32]/30 hover:border-[#cd7f32]/70 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>

                    <button
                      onClick={handleEnterArena}
                      className="flex-1 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-semibold py-3.5 px-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      Arena
                    </button>

                    <button
                      onClick={() => openSolanaExplorer(warrior.address)}
                      className="bg-[#2a2a2a] border border-gray-600 text-gray-400 font-semibold py-3.5 px-4 rounded-xl hover:text-[#cd7f32] hover:border-[#cd7f32]/50 transition-colors cursor-pointer"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Warrior Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-[#cd7f32] flex items-center gap-3">
                <Zap className="w-8 h-8" />
                Forge New Warrior
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-base font-semibold text-gray-300 mb-4">
                  Warrior Name:
                </label>
                <input
                  type="text"
                  value={newWarriorName}
                  onChange={(e) => setNewWarriorName(e.target.value)}
                  placeholder="Enter warrior name..."
                  maxLength={32}
                  className="w-full px-5 py-5 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 transition-all text-lg"
                />
                <p className="text-sm text-gray-500 mt-3">
                  {newWarriorName.length}/32 characters
                </p>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-300 mb-4">
                  DNA Code:
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newWarriorDNA}
                    onChange={(e) =>
                      setNewWarriorDNA(e.target.value.slice(0, 8).toUpperCase())
                    }
                    placeholder="DNA CODE"
                    maxLength={8}
                    className="flex-1 px-5 py-5 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 font-mono transition-all text-lg tracking-wider"
                  />
                  <button
                    onClick={() => setNewWarriorDNA(generateRandomDNA())}
                    className="px-5 py-5 bg-[#cd7f32]/20 border border-[#cd7f32]/50 rounded-xl text-[#cd7f32] hover:bg-[#cd7f32]/30 transition-colors text-xl cursor-pointer"
                    title="Generate random DNA"
                  >
                    🎲
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  8 character hex code (0-9, A-F)
                </p>
              </div>

              {/* Warrior Preview */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-[#cd7f32] mb-6 text-center flex items-center justify-center gap-3">
                  <Star className="w-6 h-6" />
                  Preview
                </h4>
                <div className="flex items-center justify-center mb-6">
                  {renderWarriorImage(
                    { name: newWarriorName, dna: newWarriorDNA },
                    true
                  )}
                </div>
                <div className="text-center space-y-3">
                  <div className="text-2xl font-bold text-[#cd7f32]">
                    {newWarriorName || "Unnamed Warrior"}
                  </div>
                  <div className="text-base text-gray-400 font-mono tracking-wider">
                    DNA: {newWarriorDNA || "XXXXXXXX"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-5 pt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-2 border-gray-600 text-gray-300 font-semibold py-5 rounded-xl hover:border-gray-500 transition-colors text-lg cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateWarrior}
                  disabled={
                    !newWarriorName.trim() ||
                    !newWarriorDNA ||
                    newWarriorDNA.length !== 8 ||
                    isCreating
                  }
                  className="flex-1 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-5 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-4 text-lg shadow-2xl"
                >
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warrior Details Modal */}
      {selectedWarrior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-[#cd7f32] flex items-center gap-3">
                <Target className="w-8 h-8" />
                Warrior Details
              </h3>
              <button
                onClick={() => setSelectedWarrior(null)}
                className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-10">
              {/* Warrior Visual & Basic Info */}
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-1/3 space-y-6">
                  <div className="relative">
                    {renderWarriorImage(selectedWarrior)}
                    <div
                      className={`mt-6 ${
                        getWarriorRank(selectedWarrior).bgColor
                      } ${
                        getWarriorRank(selectedWarrior).borderColor
                      } border-2 rounded-2xl p-6 text-center shadow-lg`}
                    >
                      <div
                        className={`text-xl font-bold ${
                          getWarriorRank(selectedWarrior).color
                        } flex items-center justify-center gap-3`}
                      >
                        <span className="text-3xl">
                          {getWarriorRank(selectedWarrior).icon}
                        </span>
                        <span>{getWarriorRank(selectedWarrior).rank}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-8">
                  <div className="text-center lg:text-left">
                    <h4 className="text-3xl md:text-4xl font-bold text-[#cd7f32] mb-4">
                      {selectedWarrior.name}
                    </h4>
                    <p className="text-gray-400 font-mono text-lg tracking-wider">
                      DNA: {selectedWarrior.dna}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 text-center">
                      <div className="text-4xl font-bold text-[#cd7f32] mb-2">
                        {selectedWarrior.powerLevel}
                      </div>
                      <div className="text-base text-gray-400 font-semibold">
                        Power Level
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        {selectedWarrior.experiencePoints}
                      </div>
                      <div className="text-base text-gray-400 font-semibold">
                        Experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combat Statistics */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-8">
                <h5 className="text-2xl font-bold text-[#cd7f32] mb-8 flex items-center gap-3">
                  <Trophy className="w-7 h-7" />
                  Combat Statistics
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-[#2a2a2a]/50 rounded-xl border border-green-500/30">
                    <div className="text-4xl font-bold text-green-400 mb-3">
                      {selectedWarrior.battleWins}
                    </div>
                    <div className="text-base text-gray-400 font-semibold">
                      Battles Won
                    </div>
                  </div>
                  <div className="text-center p-6 bg-[#2a2a2a]/50 rounded-xl border border-blue-500/30">
                    <div className="text-4xl font-bold text-blue-400 mb-3">
                      {selectedWarrior.battlesFought}
                    </div>
                    <div className="text-base text-gray-400 font-semibold">
                      Battles Fought
                    </div>
                  </div>
                  <div className="text-center p-6 bg-[#2a2a2a]/50 rounded-xl border border-yellow-500/30">
                    <div className="text-4xl font-bold text-yellow-400 mb-3">
                      {selectedWarrior.battlesFought > 0
                        ? (
                            (selectedWarrior.battleWins /
                              selectedWarrior.battlesFought) *
                            100
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </div>
                    <div className="text-base text-gray-400 font-semibold">
                      Win Rate
                    </div>
                  </div>
                </div>

                {selectedWarrior.battlesFought > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between text-base text-gray-400 mb-4">
                      <span className="font-semibold">Combat Performance</span>
                      <span className="font-bold">
                        {selectedWarrior.battleWins}/
                        {selectedWarrior.battlesFought}
                      </span>
                    </div>
                    <div className="w-full bg-[#2a2a2a] rounded-full h-4 border border-[#cd7f32]/20">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-700 shadow-lg"
                        style={{
                          width: `${
                            (selectedWarrior.battleWins /
                              selectedWarrior.battlesFought) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Blockchain Information */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-8">
                <h5 className="text-2xl font-bold text-[#cd7f32] mb-8 flex items-center gap-3">
                  <Activity className="w-7 h-7" />
                  Blockchain Data
                </h5>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <span className="text-gray-400 font-semibold text-lg">
                      Created:
                    </span>
                    <span className="text-white font-mono text-lg">
                      {new Date(
                        selectedWarrior.createdAt * 1000
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <span className="text-gray-400 font-semibold text-lg">
                      Owner:
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono break-all text-lg">
                        {selectedWarrior.owner?.toString().slice(0, 20)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedWarrior.owner)}
                        className="p-2 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded-lg transition-all duration-200"
                        title={
                          copiedAddress === selectedWarrior.owner?.toString()
                            ? "Copied!"
                            : "Copy owner address"
                        }
                      >
                        {copiedAddress === selectedWarrior.owner?.toString() ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <span className="text-gray-400 font-semibold text-lg">
                      Account Address:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          openSolanaExplorer(selectedWarrior.address)
                        }
                        className="text-[#cd7f32] hover:text-[#ff8c42] transition-colors flex items-center gap-3 font-mono break-all text-lg"
                      >
                        <span>
                          {selectedWarrior.address?.toString().slice(0, 20)}...
                        </span>
                        <ExternalLink className="w-5 h-5 flex-shrink-0" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedWarrior.address)}
                        className="p-2 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded-lg transition-all duration-200"
                        title={
                          copiedAddress === selectedWarrior.address?.toString()
                            ? "Copied!"
                            : "Copy warrior address"
                        }
                      >
                        {copiedAddress ===
                        selectedWarrior.address?.toString() ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-6">
                <button
                  onClick={handleEnterArena}
                  className="flex-1 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-5 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-4 text-lg shadow-2xl"
                >
                  <Shield className="w-6 h-6" />
                  Enter Arena
                </button>

                <button
                  onClick={() => openSolanaExplorer(selectedWarrior.address)}
                  className="bg-[#2a2a2a] border-2 border-gray-600 text-gray-400 font-semibold py-5 px-8 rounded-xl hover:text-[#cd7f32] hover:border-[#cd7f32]/50 transition-colors flex items-center justify-center gap-4 text-lg"
                >
                  <ExternalLink className="w-6 h-6" />
                  View on Solana Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Arena Access CTA */}
      {userWarriors.length > 0 && (
        <div className="bg-gradient-to-r from-[#cd7f32]/15 via-[#ff8c42]/15 to-[#cd7f32]/15 border-2 border-[#cd7f32]/40 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-[#cd7f32] flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Ready for Battle?
              </h3>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Your warriors are waiting in the arena. Choose your champion and
                fight for glory!
              </p>
              <div className="flex items-center gap-8 text-base text-gray-400">
                <span className="flex items-center gap-3">
                  <Sword className="w-5 h-5" />
                  <span className="font-semibold">
                    {userWarriors.length} Warriors Ready
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    {userWarriors.reduce((sum, w) => sum + w.battleWins, 0)}{" "}
                    Total Victories
                  </span>
                </span>
              </div>
            </div>
            <button
              onClick={handleEnterArena}
              className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold px-10 md:px-12 py-5 md:py-6 rounded-xl hover:scale-105 transition-transform flex items-center gap-4 shadow-2xl shadow-[#cd7f32]/30 text-lg md:text-xl"
            >
              <Shield className="w-7 h-7 md:w-8 md:h-8" />
              <span>Enter Battle Arena</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
