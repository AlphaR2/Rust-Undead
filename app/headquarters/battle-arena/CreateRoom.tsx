import { useGameData } from "@/hooks/useGameData";
import { Warrior } from "@/types/undead";
import { Check, Copy, Shield, Star, UserPlus, X, Zap } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
  const { userWarriors } = useGameData();
  const router = useRouter();

  const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!selectedWarrior) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const newRoomId = generateRoomId();
    setGameMode("lobby");
    setRoomId(newRoomId);
    setIsCreating(false);
  };

  const handleCopyLink = async () => {
    const gameLink = `${roomId}`;
    await navigator.clipboard.writeText(gameLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatPercentage = (stat: any, max: number) => {
    const numericStat = Number(stat);
    if (isNaN(numericStat)) {
      console.warn("Invalid stat value:", stat);
      return "0";
    }
    const statPercentage = ((numericStat * 100) / max).toFixed();
    return statPercentage;
  };

  const StatComp: React.FC<{ label: string; value: number }> = ({
    label,
    value,
  }) => {
    return (
      <div className="text-center flex items-center flex-col w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="text-gray-400 text-xs">{label}</span>
          <span className="text-[#cd7f32] font-bold">{value}</span>
        </div>
        <div className={`w-full  rounded-2xl border border-[#cd7f32]/30 h-4 `}>
          <div
            className={` bg-gradient-to-r from-[#cd7f32] h-4 to-[#ff8c42] rounded-2xl `}
            style={{
              width: `${getStatPercentage(
                value,
                label === "CURRENT HP" ? 100 : 140
              )}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  // if (isCreating) {
  //   return <DotLottieReact src={lightning}  autoplay />;
  // }
  if (gameMode === "lobby") {
    return (
      <div className="min-h-screen  relative z-[40] ">
        {/* <DotLottieReact src={lightning}  autoplay />; */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Room Created!
              </h2>
              <p className="text-gray-400">
                Share this link with your opponent
              </p>
            </div>

            {/* Room Info */}
            <div className="rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Room ID:</span>
                <span className="text-white font-bold text-lg">{roomId}</span>
              </div>
              {/* <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Host:</span>
                <span className="text-white">{playerName}</span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Warrior:</span>
                <span className="text-orange-400">{selectedWarrior?.name}</span>
              </div>
            </div>

            {/* Share Link */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Room Id:
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={`${roomId}`}
                  readOnly
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg border border-gray-600 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-r-lg border border-l-0 border-gray-600 transition-colors ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Waiting for Opponent */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <UserPlus size={20} className="text-yellow-400" />
                <span className="text-yellow-400">Waiting for opponent...</span>
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>

            {/* Start Game Button (for demo) */}
            <button
              onClick={() =>
                router.push(`/headquarters/battle-arena/${roomId}`)
              }
              className="w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Start Game (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "creation") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-3xl p-8 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 via-transparent to-[#ff8c42]/5 rounded-3xl"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-8 md:mb-10">
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

            <div className="flex flex-row gap-8">
              {/* Left: Form */}
              <div className="space-y-6 w-[40%]">
                {/* Class Selection */}
                <span>How it works</span>
                <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                  <li>Select your warrior</li>
                  <li>Generate room ID</li>
                  <li>Share with your oppponent.</li>
                </div>
                {/* <div>
                  <div className="mb-8">
                    <label className="block text-white text-lg font-medium mb-2">
                      Enter Your username
                    </label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your room username..."
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none transition-colors"
                      maxLength={20}
                    />
                  </div>
                </div> */}
                <div>
                  <span>Choose a warrior</span>
                  {userWarriors?.map((warrior, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() =>
                          selectedWarrior
                            ? setSelectedWarrior(null)
                            : setSelectedWarrior(warrior)
                        }
                        className="flex flex-row border-[#cd7f32]/30 p-2 gap-x-2 items-center border rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full ">
                          <img
                            // width={100}
                            // height={100}
                            src={warrior.imageUri}
                            alt="warrior-image"
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <span>{warrior.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-6 w-[60%]">
                <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#cd7f32]/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-evenly">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/5 to-transparent"></div>
                  <div className="flex items-center text-center">
                    <h4 className="relative text-2xl font-bold text-[#cd7f32] mb-6 text-center flex items-center justify-center gap-3">
                      <Star className="w-6 h-6 animate-pulse" />
                      Warrior Preview
                    </h4>
                  </div>
                  {selectedWarrior ? (
                    <section className="flex flex-row gap-2">
                      {
                        <img
                          className="w-[50%] h-[50%] rounded-2xl"
                          src={selectedWarrior?.imageUri}
                        />
                      }
                      <div className="flex flex-col  w-full">
                        <div className="flex flex-row justify-center items-center">
                          <span>LEVEL</span>
                          <span>{selectedWarrior?.level}</span>
                        </div>

                        <div className="flex flex-col  h-32 gap-2 w-full">
                          <StatComp
                            label={"ATTACK"}
                            value={selectedWarrior?.baseAttack}
                          />
                          <StatComp
                            label={"DEFENCE"}
                            value={selectedWarrior?.baseDefense}
                          />
                          <StatComp
                            label={"KNOWLEDGE"}
                            value={selectedWarrior?.baseKnowledge}
                          />
                          <StatComp
                            label={"CURRENT HP"}
                            value={selectedWarrior?.currentHp}
                          />
                        </div>
                      </div>
                    </section>
                  ) : (
                    <div className="w-[450px] h-[245px] flex items-center justify-center text-center mx-auto">
                      <span className="text-2xl">
                        Select a warrior to preview
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateRoom();
                    }}
                    className="w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-semibold py-2.5 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                    <Shield className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Create Room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// Demo Component


export default RoomCreation;
