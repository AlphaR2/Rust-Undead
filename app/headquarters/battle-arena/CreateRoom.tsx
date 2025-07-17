import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameData } from "@/hooks/useGameData";
import { ImageRarity, Warrior, WarriorClass } from "@/types/undead";
import {
  Check,
  Copy,
  Shield,
  Star,
  UserPlus,
  X,
  Zap,
  Eye,
  Sword,
  Heart,
  Brain,
  Award,
  Crown,
  ChevronLeft,
} from "lucide-react";

interface RoomCreationProps {
  gameMode: string;
  setGameMode: React.Dispatch<React.SetStateAction<string>>;
}

const RoomCreation: React.FC<RoomCreationProps> = ({
  gameMode,
  setGameMode,
}) => {
  const [selectedWarrior, setSelectedWarrior] = useState<Warrior | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewingWarrior, setViewingWarrior] = useState<Warrior | null>(null);
  const { userWarriors } = useGameData();
  const router = useRouter();

  const generateRoomId = (): { battleRoomId: number[]; displayId: string } => {
    const uint8Array = crypto.getRandomValues(new Uint8Array(32));
    const battleRoomId = Array.from(uint8Array);
    const displayId = btoa(String.fromCharCode(...uint8Array))
      .replace(/[+/]/g, (c) => (c === "+" ? "-" : "_"))
      .replace(/=+$/, "");

    return { battleRoomId, displayId };
  };

  // Decode function for joining rooms
  // const decodeRoomId = (displayId: string): number[] => {
  //   try {
  //     // Restore base64 format
  //     let base64 = displayId.replace(/[-_]/g, (c) => (c === '-' ? '+' : '/'));

  //     // Add padding if needed
  //     while (base64.length % 4) {
  //       base64 += '=';
  //     }

  //     // Decode base64 to bytes
  //     const binaryString = atob(base64);
  //     const bytes = [];
  //     for (let i = 0; i < binaryString.length; i++) {
  //       bytes.push(binaryString.charCodeAt(i));
  //     }

  //     if (bytes.length !== 32) {
  //       throw new Error('Invalid room code length');
  //     }

  //     return bytes;
  //   } catch (error) {
  //     throw new Error('Invalid room code format');
  //   }
  // };

  const handleCreateRoom = async () => {
    if (!selectedWarrior) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const newRoomId = generateRoomId();
    setGameMode("lobby");
    setRoomId(newRoomId.displayId); // we will use newRoomId.battleRoomId for smart contract.
    setIsCreating(false);
  };

  const handleCopyLink = async () => {
    const gameLink = safeRenderString(roomId);
    await navigator.clipboard.writeText(gameLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const getStatPercentage = (stat: any, max: number) => {
  //   const numericStat = safeToNumber(stat);
  //   const statPercentage = ((numericStat * 100) / max).toFixed();
  //   return statPercentage;
  // };

  const getClassIcon = (warriorClass: WarriorClass | string | any) => {
    // Handle enum object or string
    let classValue: string;
    if (typeof warriorClass === "object" && warriorClass !== null) {
      // If it's an enum object, get the first key
      const keys = Object.keys(warriorClass);
      classValue = keys.length > 0 ? keys[0] : "unknown";
    } else {
      classValue = String(warriorClass || "unknown");
    }

    const classLower = classValue.toLowerCase();
    switch (classLower) {
      case "validator":
        return "⚖️ - validator";
      case "oracle":
        return "🔮 - oracle";
      case "guardian":
        return "🛡️ - guardian";
      case "daemon":
        return "⚔️ - daemon";
      default:
        return "💻";
    }
  };

  const getClassDescription = (warriorClass: WarriorClass | string | any) => {
    // Handle enum object or string
    let classValue: string;
    if (typeof warriorClass === "object" && warriorClass !== null) {
      // If it's an enum object, get the first key
      const keys = Object.keys(warriorClass);
      classValue = keys.length > 0 ? keys[0] : "unknown";
    } else {
      classValue = String(warriorClass || "unknown");
    }

    const classLower = classValue.toLowerCase();
    switch (classLower) {
      case "validator":
        return "Balanced fighter with steady performance";
      case "oracle":
        return "Knowledge specialist with high wisdom";
      case "guardian":
        return "Tank with exceptional defense";
      case "daemon":
        return "Glass cannon with devastating attacks";
      default:
        return "Mysterious warrior class";
    }
  };

  const getRarityString = (imageRarity: ImageRarity | any): string => {
    // Add debug logging
    console.log("getRarityString input:", imageRarity, typeof imageRarity);

    if (typeof imageRarity === "string") {
      return imageRarity;
    }
    if (typeof imageRarity === "object" && imageRarity !== null) {
      const keys = Object.keys(imageRarity);
      if (keys.length > 0) {
        const result = keys[0].charAt(0).toUpperCase() + keys[0].slice(1);
        console.log("getRarityString result:", result);
        return result;
      }
    }
    return "Common";
  };

  // Helper function to safely convert BN or number to number
  const safeToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "object" && value.toNumber) {
      return value.toNumber();
    }
    return Number(value) || 0;
  };

  // Helper function to get warrior class string
  const getWarriorClassString = (
    warriorClass: WarriorClass | string | any
  ): string => {
    console.log(
      "getWarriorClassString input:",
      warriorClass,
      typeof warriorClass
    );

    if (typeof warriorClass === "object" && warriorClass !== null) {
      const keys = Object.keys(warriorClass);
      const result = keys.length > 0 ? keys[0] : "unknown";
      console.log("getWarriorClassString result:", result);
      return result;
    }
    const result = String(warriorClass || "unknown");
    console.log("getWarriorClassString result:", result);
    return result;
  };

  // Helper function to safely render any value as string
  const safeRenderString = (value: any): string => {
    console.log("safeRenderString input:", value, typeof value);

    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return String(value);
    if (typeof value === "object" && value !== null) {
      // Handle BN objects
      if (value.toNumber && typeof value.toNumber === "function") {
        return String(value.toNumber());
      }
      // Handle enum objects
      const keys = Object.keys(value);
      if (keys.length > 0) {
        const result = keys[0].charAt(0).toUpperCase() + keys[0].slice(1);
        console.log("safeRenderString object result:", result);
        return result;
      }
      // Fallback for objects
      console.warn("safeRenderString: Unexpected object structure:", value);
      return JSON.stringify(value);
    }
    const result = String(value);
    console.log("safeRenderString fallback result:", result);
    return result;
  };

  // Warrior Details Modal
  const WarriorDetailsModal: React.FC<{ warrior: Warrior }> = ({ warrior }) => {
    const safeWarrior = {
      name: String(warrior?.name || "Unknown Warrior"),
      imageUri: String(warrior?.imageUri || ""),
      level: safeToNumber(warrior?.level),
      warriorClass: warrior?.warriorClass,
      baseAttack: safeToNumber(warrior?.baseAttack),
      baseDefense: safeToNumber(warrior?.baseDefense),
      baseKnowledge: safeToNumber(warrior?.baseKnowledge),
      currentHp: safeToNumber(warrior?.currentHp),
      battlesWon: safeToNumber(warrior?.battlesWon),
      battlesLost: safeToNumber(warrior?.battlesLost),
      experience: safeToNumber(warrior?.experiencePoints),
      dna: Array.isArray(warrior?.dna) ? warrior.dna : [],
      imageRarity: getRarityString(warrior?.imageRarity),
    };

    const totalBattles = safeWarrior.battlesWon + safeWarrior.battlesLost;
    let performanceRank = "Untested";
    if (totalBattles > 0) {
      const winRate = safeWarrior.battlesWon / totalBattles;
      if (winRate >= 0.7) performanceRank = "Elite Warrior";
      else if (winRate >= 0.5) performanceRank = "Veteran Fighter";
      else performanceRank = "Rising Challenger";
    }

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewingWarrior(null)}
                  className="text-gray-400 hover:text-[#cd7f32] transition-colors p-2 hover:bg-[#cd7f32]/10 rounded-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent">
                  Warrior Details
                </h3>
              </div>
              <button
                onClick={() => setViewingWarrior(null)}
                className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Warrior Image & Basic Info */}
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={safeRenderString(safeWarrior.imageUri)}
                    alt={safeRenderString(safeWarrior.name)}
                    className="w-full h-80 object-cover rounded-2xl border-2 border-[#cd7f32]/30"
                  />
                  <div className="absolute top-4 right-4 bg-[#cd7f32]/90 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Level {safeWarrior.level}
                  </div>
                </div>
              </div>

              {/* Right: Stats*/}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-[#0f0f0f]/50 rounded-2xl p-6 border border-[#cd7f32]/20">
                  <h4 className="text-2xl font-bold text-[#cd7f32] mb-4 flex items-center gap-3">
                    <span className="text-xl">
                      {getClassIcon(safeWarrior.warriorClass)}
                    </span>
                    {safeRenderString(safeWarrior.name)}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Class:</span>
                      <span className="text-white font-bold capitalize">
                        {safeRenderString(
                          getWarriorClassString(safeWarrior.warriorClass)
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 italic">
                      {safeRenderString(
                        getClassDescription(safeWarrior.warriorClass)
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Battles Won:</span>
                      <span className="text-[#cd7f32] font-bold">
                        {safeWarrior.battlesWon}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Battles Lost:</span>
                      <span className="text-red-400 font-bold">
                        {safeWarrior.battlesLost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-purple-400 font-bold">
                        {safeWarrior.experience} XP
                      </span>
                    </div>

                    {/* performance rank  */}
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-[#cd7f32]">
                        Performance Rank:
                      </span>
                      <div className="text-lg font-bold text-white">
                        {safeRenderString(performanceRank)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedWarrior(warrior);
                      setViewingWarrior(null);
                    }}
                    className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Select Warrior
                  </button>
                  <button
                    onClick={() => setViewingWarrior(null)}
                    className="bg-[#2a2a2a] border border-[#cd7f32]/30 text-[#cd7f32] font-bold py-3 px-4 rounded-lg hover:bg-[#cd7f32]/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (gameMode === "lobby") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-6 max-w-5xl w-full h-[96vh] shadow-2xl relative overflow-hidden flex flex-col">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-[#cd7f32]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header - Compact */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent mb-2">
                Battle Room Ready
              </h2>
              <p className="text-gray-400">Waiting for opponent to join</p>
            </div>

            {/* Battle Arena - Compact Warriors */}
            <div className="grid grid-cols-3 gap-6 mb-6 flex-1 max-h-80">
              {/* Player 1 (Your Warrior) - Compact */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border-2 border-[#cd7f32]/50 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/10 to-transparent"></div>

                <div className="relative z-10 text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <h3 className="text-[#cd7f32] font-bold text-sm mb-3">
                    YOUR WARRIOR
                  </h3>

                  {/* Compact Warrior Display */}
                  <div className="relative mb-3">
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-[#cd7f32]/30">
                      <img
                        src={safeRenderString(selectedWarrior?.imageUri)}
                        alt={safeRenderString(selectedWarrior?.name)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black px-1.5 py-0.5 rounded-full text-xs font-bold">
                      {safeToNumber(selectedWarrior?.level)}
                    </div>
                  </div>

                  {/* Compact Warrior Info */}
                  <h4 className="text-white font-bold text-sm mb-2 truncate">
                    {safeRenderString(selectedWarrior?.name)}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-lg">
                      {getClassIcon(selectedWarrior?.warriorClass)}
                    </span>
                    <span className="text-[#cd7f32] text-xs font-medium uppercase">
                      {getWarriorClassString(selectedWarrior?.warriorClass)}
                    </span>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-red-400 font-bold">
                        {safeToNumber(selectedWarrior?.baseAttack)}
                      </div>
                      <div className="text-gray-500">ATK</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">
                        {safeToNumber(selectedWarrior?.baseDefense)}
                      </div>
                      <div className="text-gray-500">DEF</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">
                        {safeToNumber(selectedWarrior?.baseKnowledge)}
                      </div>
                      <div className="text-gray-500">KNW</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VS Section - Compact */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-3 border-[#cd7f32]/30 rounded-full flex items-center justify-center relative">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent">
                      VS
                    </span>
                    <div className="absolute inset-0 border-3 border-[#cd7f32]/50 rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Compact Room Code */}
                <div className="bg-[#cd7f32]/10 border border-[#cd7f32]/30 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">ROOM</div>
                  <div className="text-[#cd7f32] font-mono font-bold text-sm tracking-wider">
                    {roomId ? safeRenderString(roomId) : "GENERATING..."}
                  </div>
                </div>
              </div>

              {/* Player 2 (Waiting) - Compact */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border-2 border-dashed border-gray-600 rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <h3 className="text-gray-400 font-bold text-sm mb-3">
                    OPPONENT
                  </h3>

                  {/* Compact Waiting Avatar */}
                  <div className="relative mb-3">
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-gray-600/50 bg-gray-800/50 flex items-center justify-center">
                      <div className="text-4xl text-gray-600 animate-pulse">
                        👤
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                      ?
                    </div>
                  </div>

                  <h4 className="text-gray-500 font-bold text-sm mb-2">
                    Waiting...
                  </h4>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <UserPlus size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 text-xs">Searching</span>
                  </div>

                  {/* Mini animated dots */}
                  <div className="flex justify-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized Share Section */}
            <div className="bg-gradient-to-r from-[#cd7f32]/10 to-[#ff8c42]/10 border border-[#cd7f32]/30 rounded-2xl p-5 mb-6">
              <h3 className="text-white font-bold text-lg mb-3 text-center flex items-center justify-center gap-2">
                <Copy size={20} className="text-[#cd7f32]" />
                Share Room Code
              </h3>

              {/* Large, Prominent Room Code Display */}
              <div className="bg-black/30 border-2 border-[#cd7f32]/50 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">Room Code</div>
                  <div className="text-3xl font-mono font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent tracking-widest">
                    {roomId ? safeRenderString(roomId) : "GENERATING..."}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopyLink}
                disabled={!roomId}
                className={`w-full py-3 rounded-xl border transition-all duration-300 font-bold ${
                  copied
                    ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/30"
                    : "bg-[#cd7f32]/20 text-[#cd7f32] border-[#cd7f32]/50 hover:bg-[#cd7f32]/30 hover:scale-105 disabled:opacity-50"
                }`}
              >
                {copied ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check size={20} />
                    <span>Copied to Clipboard!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Copy size={20} />
                    <span>Copy Room Code</span>
                  </div>
                )}
              </button>
            </div>

            {/* Compact Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button
                onClick={() => setGameMode("")}
                className="bg-gray-800 border border-gray-600 text-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/headquarters/battle-arena/${safeRenderString(roomId)}`
                  )
                }
                className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-3 px-4 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-[#cd7f32]/30 transition-all duration-300"
              >
                Start Battle (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "creation") {
    return (
      <>
        {/* Warrior Details Modal */}
        {viewingWarrior && <WarriorDetailsModal warrior={viewingWarrior} />}

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-6xl w-full h-[96vh] shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] bg-clip-text text-transparent flex items-center gap-3">
                  <Zap className="w-8 h-8 text-[#cd7f32]" />
                  Create a battle room
                </h3>
                <button
                  onClick={() => setGameMode("")}
                  className="text-gray-400 hover:text-[#cd7f32] transition-colors p-3 hover:bg-[#cd7f32]/10 rounded-xl group"
                >
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex flex-row gap-8 flex-1 overflow-hidden">
                {/* Left: Form - Fixed width, scrollable content */}
                <div className="w-[40%] flex flex-col">
                  <div className="space-y-6 flex-1">
                    {/* How it works */}
                    <div>
                      <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                        <ul className="space-y-2 text-gray-300 relative">
                          <li>• Select your warrior</li>
                          <li>• Generate room ID</li>
                          <li>• Share with your opponent</li>
                        </ul>
                      </div>
                    </div>

                    {/* Warriors list - scrollable */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <span className="text-white text-lg font-medium mb-4 flex-shrink-0">
                        Choose a warrior
                      </span>
                      {/* scrollable here */}
                      <div className="space-y-4 pr-1 overflow-y-auto max-h-64">
                        {userWarriors &&
                        Array.isArray(userWarriors) &&
                        userWarriors.length > 0 ? (
                          userWarriors.map((warrior, i) => {
                            console.log("Warrior data:", warrior);

                            const safeWarrior = {
                              name: String(warrior?.name || "Unknown"),
                              imageUri: String(warrior?.imageUri || ""),
                              level: safeToNumber(warrior?.level),
                              warriorClass: getWarriorClassString(
                                warrior?.warriorClass
                              ),
                              warriorRarity: getRarityString(
                                warrior?.imageRarity
                              ),
                            };

                            console.log("Safe warrior:", safeWarrior);

                            return (
                              <div
                                key={i}
                                className={`flex flex-row border p-2 gap-x-2 items-center rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] transition-all duration-200 ${
                                  selectedWarrior?.name === warrior.name
                                    ? "border-[#cd7f32] bg-[#cd7f32]/5"
                                    : "border-[#cd7f32]/30 hover:border-[#cd7f32]/50"
                                }`}
                              >
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                  <img
                                    src={safeRenderString(safeWarrior.imageUri)}
                                    alt={safeRenderString(safeWarrior.name)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-medium">
                                      {safeRenderString(safeWarrior.name)}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      Lv.{safeWarrior.level}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {safeRenderString(
                                        safeWarrior.warriorRarity
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => setViewingWarrior(warrior)}
                                    className="p-2 bg-[#cd7f32]/20 text-[#cd7f32] hover:bg-[#cd7f32]/30 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      selectedWarrior?.name === warrior.name
                                        ? setSelectedWarrior(null)
                                        : setSelectedWarrior(warrior)
                                    }
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                      selectedWarrior?.name === warrior.name
                                        ? "bg-[#cd7f32] text-black"
                                        : "bg-[#cd7f32]/20 text-[#cd7f32] hover:bg-[#cd7f32]/30"
                                    }`}
                                  >
                                    {selectedWarrior?.name === warrior.name
                                      ? "Selected"
                                      : "Select"}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-gray-400 py-8">
                            <p>No warriors available</p>
                            <p className="text-sm">
                              Create your first warrior to start battling!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Preview - Fixed, no scroll */}
                <div className="w-[60%] flex flex-col">
                  <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>

                    {/* <div className="flex items-center justify-center mb-6">
                      <h4 className="relative text-2xl font-bold text-[#cd7f32] flex items-center gap-3">
                        <Star className="w-6 h-6 animate-pulse" />
                        Warrior Preview
                      </h4>
                    </div> */}

                    {selectedWarrior ? (
                      <div className="flex flex-col flex-1">
                        {/* Warrior Card */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/30 rounded-2xl p-4 mb-4 relative overflow-hidden group hover:border-[#cd7f32]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#cd7f32]/20">
                          {/* Glowing background effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/10 via-transparent to-[#ff8c42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative z-10">
                            {/* Header with Class Icon */}
                            <div className="flex items-center justify-between mb-4">
                              {/* Class Badge */}
                              <div className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                                <span className="text-sm">
                                  {getClassIcon(selectedWarrior?.warriorClass)}
                                </span>
                              </div>
                            </div>

                            {/* Warrior Image and Stats Layout */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Left: Warrior Image */}
                              <div className="relative">
                                <div className="aspect-square relative overflow-hidden rounded-xl border border-[#cd7f32]/20 group-hover:border-[#cd7f32]/40 transition-colors">
                                  <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    src={safeRenderString(
                                      selectedWarrior?.imageUri
                                    )}
                                    alt={safeRenderString(
                                      selectedWarrior?.name
                                    )}
                                  />
                                  {/* Gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                </div>
                              </div>

                              {/* Right: Combat Stats */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-bold text-[#cd7f32] mb-3 flex items-center gap-2">
                                  <Sword className="w-4 h-4" />
                                  Combat Stats
                                </h4>

                                {/* Attack Stat */}
                                <div className="group/stat hover:bg-red-500/5 p-2 rounded-lg transition-colors">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1 bg-red-500/20 rounded group-hover/stat:bg-red-500/30 transition-colors">
                                      <Sword className="w-3 h-3 text-red-400" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">
                                      ATK
                                    </span>
                                    <span className="ml-auto text-sm font-bold text-red-400">
                                      {safeToNumber(
                                        selectedWarrior?.baseAttack
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (safeToNumber(
                                            selectedWarrior?.baseAttack
                                          ) /
                                            140) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Defense Stat */}
                                <div className="group/stat hover:bg-blue-500/5 p-2 rounded-lg transition-colors">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1 bg-blue-500/20 rounded group-hover/stat:bg-blue-500/30 transition-colors">
                                      <Shield className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">
                                      DEF
                                    </span>
                                    <span className="ml-auto text-sm font-bold text-blue-400">
                                      {safeToNumber(
                                        selectedWarrior?.baseDefense
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (safeToNumber(
                                            selectedWarrior?.baseDefense
                                          ) /
                                            140) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Knowledge Stat */}
                                <div className="group/stat hover:bg-purple-500/5 p-2 rounded-lg transition-colors">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1 bg-purple-500/20 rounded group-hover/stat:bg-purple-500/30 transition-colors">
                                      <Brain className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">
                                      KNW
                                    </span>
                                    <span className="ml-auto text-sm font-bold text-purple-400">
                                      {safeToNumber(
                                        selectedWarrior?.baseKnowledge
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-1.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (safeToNumber(
                                            selectedWarrior?.baseKnowledge
                                          ) /
                                            140) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* HP Stat */}
                                <div className="group/stat hover:bg-green-500/5 p-2 rounded-lg transition-colors">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1 bg-green-500/20 rounded group-hover/stat:bg-green-500/30 transition-colors">
                                      <Heart className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">
                                      HP
                                    </span>
                                    <span className="ml-auto text-sm font-bold text-green-400">
                                      {safeToNumber(selectedWarrior?.currentHp)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (safeToNumber(
                                            selectedWarrior?.currentHp
                                          ) /
                                            100) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Create Room Button */}
                        <button
                          onClick={handleCreateRoom}
                          disabled={isCreating}
                          className="w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold py-3 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-[#cd7f32]/30 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c42] to-[#cd7f32] opacity-0 hover:opacity-20 transition-opacity duration-300"></div>

                          <div className="relative z-10 flex items-center gap-2">
                            {isCreating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating Battle Room...</span>
                              </>
                            ) : (
                              <>
                                <Shield className="w-4 h-4" />
                                <span>Create Battle Room</span>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#cd7f32]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Star className="w-8 h-8 text-[#cd7f32]" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-400 mb-2">
                            Select Your Champion
                          </h3>
                          <p className="text-sm text-gray-500">
                            Choose a warrior to see their stats
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default RoomCreation;
