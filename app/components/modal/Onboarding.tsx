import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  ChevronRight,
  Volume2,
  VolumeX,
  Loader2,
  Globe,
  Brain,
  Target,
  Crown,
  AlertCircle,
  CheckCircle,
  Dice6,
  Sparkles,
} from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useUndeadProgram,
  usePDAs,
  useWalletInfo,
  useCurrentWallet,
} from "@/hooks/useUndeadProgram";
import {
  createWarriorWithVRF,
  generateRandomDNA,
  WARRIOR_CLASS_INFO,
  VRFStage,
  WarriorCreationResult,
} from "@/hooks/useGameActions";
import { Warrior, WarriorClass } from "@/types/undead";
import WarriorCard from "../Card";
import { PublicKey } from "@solana/web3.js";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data?: {
    selectedPath?: string;
    warriorName?: string;
    warriorClass?: WarriorClass;
    warriorDNA?: string;
    creationSuccess?: boolean;
    warrior?: any;
  }) => void;
}

interface LearningPath {
  id: string;
  title: string;
  icon: string;
  description: string;
  bonus: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface Skill {
  icon: string;
  text: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [warriorName, setWarriorName] = useState<string>("");
  const [warriorDNA, setWarriorDNA] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<WarriorClass | null>(null);
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [skillsRevealed, setSkillsRevealed] = useState<number[]>([]);
  const [isCreatingWarrior, setIsCreatingWarrior] = useState<boolean>(false);
  const [creationError, setCreationError] = useState<string>("");
  const [creationSuccess, setCreationSuccess] = useState<boolean>(false);
  const [vrfStage, setVrfStage] = useState<VRFStage>({
    stage: "initializing",
    progress: 0,
  });
  const [vrfMessage, setVrfMessage] = useState<string>("");
  const [createdWarrior, setCreatedWarrior] = useState<Warrior | null>(null);

  // Updated wallet hooks
  const { authenticated, user } = usePrivy();
  const { publicKey, isConnected, walletType } = useWalletInfo();
  const { address: walletAddress, name: walletName } = useCurrentWallet();

  // Solana program integration
  const program = useUndeadProgram();
  const { configPda, profilePda, getWarriorPda, achievementsPda } =
    usePDAs(publicKey);

  const totalSteps = 6;

  const typewriterTexts = [
    "The blockchain realm has awakened ancient mysteries...",
    "Only those who understand the fundamental forces can command the undead networks.",
    "Master the deep concepts that power decentralized worlds.",
  ];

  const skills: Skill[] = [
    { icon: "🧠", text: "Understand how distributed systems really work" },
    { icon: "⚡", text: "Master blockchain architecture and design patterns" },
    { icon: "🔗", text: "Explore cryptographic foundations and security" },
    { icon: "🎮", text: "Learn through interactive gameplay and simulations" },
    { icon: "💻", text: "Apply knowledge by building real applications" },
  ];

  const paths: LearningPath[] = [
    {
      id: "explorer",
      title: "Blockchain Explorer",
      icon: "🔍",
      description: "Complete beginner - Start with fundamental concepts",
      bonus: "Extra conceptual guidance",
      difficulty: "Beginner",
    },
    {
      id: "architect",
      title: "Network Architect",
      icon: "🏗️",
      description: "Some tech background - Intermediate concepts",
      bonus: "Balanced theory & practice",
      difficulty: "Intermediate",
    },
    {
      id: "master",
      title: "Consensus Master",
      icon: "🧙‍♂️",
      description: "Technical expert - Advanced blockchain design",
      bonus: "Deep technical insights",
      difficulty: "Advanced",
    },
  ];

  // Initialize modal state
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setWarriorName("");
      setSelectedPath(null);
      setSelectedClass(null);
      setTypewriterText("");
      setSkillsRevealed([]);
      setCreationError("");
      setCreationSuccess(false);
      setIsCreatingWarrior(false);
      setCreatedWarrior(null);

      const initialDNA = generateRandomDNA();
      setWarriorDNA(initialDNA);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentStep === 1) {
      let index = 0;
      const fullText = Object.values(typewriterTexts).join("");
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setTypewriterText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Skills reveal animation
  useEffect(() => {
    if (currentStep === 2) {
      setSkillsRevealed([]);
      skills.forEach((_, index) => {
        setTimeout(() => {
          setSkillsRevealed((prev) => [...prev, index]);
          playSound("clang");
        }, index * 600);
      });
    }
  }, [currentStep]);

  // Enhanced sound effects
  const playSound = (type: string) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const createTone = (
        frequency: number,
        duration: number,
        waveType: "sine" | "square" | "sawtooth" = "sine"
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        oscillator.type = waveType;

        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      switch (type) {
        case "mystical":
          createTone(220, 0.4, "sine");
          setTimeout(() => createTone(330, 0.3, "sine"), 200);
          break;
        case "clang":
          createTone(800, 0.2);
          setTimeout(() => createTone(600, 0.15), 50);
          break;
        case "epic":
          createTone(440, 0.3);
          setTimeout(() => createTone(554, 0.3), 200);
          setTimeout(() => createTone(659, 0.5), 400);
          break;
        case "success":
          createTone(523, 0.2);
          setTimeout(() => createTone(659, 0.2), 150);
          setTimeout(() => createTone(784, 0.3), 300);
          break;
      }
    } catch (error) {
      console.warn("Audio not supported in this browser:", error);
    }
  };

  // Create warrior with VRF handling
  const handleCreateWarrior = async () => {
    if (
      !program ||
      !publicKey ||
      !configPda ||
      !profilePda ||
      !getWarriorPda ||
      !warriorName.trim() ||
      !selectedClass
    ) {
      setCreationError(
        "Please ensure wallet is connected and all fields are filled"
      );
      return;
    }

    const finalDNA = warriorDNA || generateRandomDNA();
    if (!finalDNA || finalDNA.length !== 8) {
      setCreationError("Invalid DNA sequence. Please try again.");
      return;
    }

    setIsCreatingWarrior(true);
    setCreationError("");
    setCreationSuccess(false);

    try {
      const warriorPda = getWarriorPda(warriorName.trim());

      const result: WarriorCreationResult = await createWarriorWithVRF({
        program,
        userPublicKey: publicKey,
        name: warriorName.trim(),
        dna: finalDNA,
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
        const warrior: any = result?.warrior;
        setCreationSuccess(true);
        setCreatedWarrior(warrior);
        playSound("success");
        // Auto-advance after success
        setTimeout(() => {
          nextStep();
        }, 3000);
      } else {
        setCreationError(result.error || "Failed to create warrior");
      }
    } catch (error) {
      setCreationError("Unexpected error occurred. Please try again.");
      console.error("Warrior creation error:", error);
    } finally {
      setIsCreatingWarrior(false);
    }
  };

  // Navigation with sound effects
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      playSound("mystical");
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      playSound("clang");
    }
  };

  const handleComplete = () => {
    playSound("epic");
    setTimeout(() => {
      onComplete({
        selectedPath: selectedPath || "architect",
        warriorName: warriorName || "Unnamed Warrior",
        warriorClass: selectedClass || WarriorClass.Validator,
        warriorDNA: warriorDNA || "XXXXXXXX",
        creationSuccess,
        warrior: createdWarrior,
      });
    }, 500);
  };

  // Generate warrior account code with proper structure
  const generateWarriorAccountCode = (
    name: string,
    dna: string,
    warriorClass: WarriorClass | null
  ) => {
    const className = warriorClass ? warriorClass.toLowerCase() : "validator";

    return `#[account]
#[derive(InitSpace)]
pub struct UndeadWarrior {
    #[max_len(32)]
    pub name: "${name || "Unnamed"}",          
    pub owner: Pubkey,              // ${publicKey?.toString().slice(0, 8)}...
    pub dna: [u8; 8],              // ${dna || "XXXXXXXX"} (visual DNA)
    pub created_at: i64,           // Unix timestamp
    pub base_attack: u16,          // VRF Generated (${getStatRange(
      warriorClass,
      "attack"
    )})
    pub base_defense: u16,         // VRF Generated (${getStatRange(
      warriorClass,
      "defense"
    )})
    pub base_knowledge: u16,       // VRF Generated (${getStatRange(
      warriorClass,
      "knowledge"
    )})
    pub current_hp: u16,           // Starts at 100
    pub max_hp: u16,              // Starts at 100
    pub warrior_class: WarriorClass::${
      className.charAt(0).toUpperCase() + className.slice(1)
    },
    pub battles_won: u32,          // Starts at 0
    pub battles_lost: u32,         // Starts at 0
    pub experience_points: u64,    // Earned through battles
    pub level: u16,               // Calculated from XP
    pub image_rarity: ImageRarity, // VRF determines rarity
    pub image_index: u8,          // VRF selects specific image
    pub image_uri: String,        // Generated image URL
    pub last_battle_at: i64,      // Cooldown tracking
    pub cooldown_expires_at: i64, // Battle cooldown
    pub bump: u8,                 // PDA bump seed
}

// 🔥 This creates a PERMANENT on-chain account!
// - Costs ~0.002 SOL in rent (refundable)
// - Stats and image determined by VRF (provably fair)
// - Fully owned by your wallet forever`;
  };

  const getStatRange = (
    warriorClass: WarriorClass | null,
    stat: "attack" | "defense" | "knowledge"
  ): string => {
    if (!warriorClass) return "50-100";

    const info = WARRIOR_CLASS_INFO[warriorClass];
    if (!info) return "50-100";

    // Extract ranges from stat distribution
    if (info.statDistribution.includes("High")) {
      if (stat === "attack" && warriorClass === WarriorClass.Daemon)
        return "100-140";
      if (stat === "defense" && warriorClass === WarriorClass.Guardian)
        return "100-140";
      if (stat === "knowledge" && warriorClass === WarriorClass.Oracle)
        return "100-140";
    }
    if (
      info.statDistribution.includes("Balanced") &&
      warriorClass === WarriorClass.Validator
    ) {
      return "70-110";
    }
    if (
      info.statDistribution.includes("Low DEF") &&
      stat === "defense" &&
      warriorClass === WarriorClass.Daemon
    ) {
      return "40-60";
    }

    return "60-100"; // Default moderate range
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-[#cd7f32]/30 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] flex-shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-full bg-[#0f0f0f] h-3 flex-shrink-0 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#cd7f32] via-[#ff8c42] to-[#cd7f32] transition-all duration-700 ease-out relative"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#cd7f32]/20 to-transparent animate-pulse" />
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* Step 1: Welcome & Introduction */}
          {currentStep === 1 && (
            <div className="text-center space-y-8 animate-in fade-in-50 duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative text-7xl mb-8 animate-bounce">
                  🌐🧠
                </div>
              </div>

              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-2xl font-bold text-[#cd7f32] min-h-[100px] flex items-center justify-center">
                  <span className="typewriter text-center leading-relaxed">
                    {typewriterText}
                  </span>
                </div>

                <div className="space-y-4 text-lg text-gray-300">
                  <p className="opacity-90">
                    Welcome to the most comprehensive blockchain learning
                    experience
                  </p>
                  <p className="opacity-70">
                    Master Solana through interactive gameplay and real on-chain
                    experiences
                  </p>
                </div>

                {!isConnected && (
                  <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 max-w-lg mx-auto">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {authenticated
                        ? "Create or connect a wallet for the full blockchain experience!"
                        : "Sign in and connect your wallet for the full blockchain experience!"}
                    </p>
                  </div>
                )}

                {isConnected && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 max-w-lg mx-auto">
                    <p className="text-green-300 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Perfect! Your {walletName} is connected and ready for
                      blockchain interactions.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={nextStep}
                className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#cd7f32]/50"
              >
                <span className="flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  Begin Your Journey
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          )}

          {/* Step 2: Skills Preview */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in-50 duration-700">
              <div className="text-center">
                <div className="text-5xl mb-4">🧠⚡🌐</div>
                <h3 className="text-3xl font-bold text-[#cd7f32] mb-2">
                  Master These Skills
                </h3>
                <p className="text-gray-300 text-lg">
                  Essential blockchain concepts through engaging gameplay
                </p>
              </div>

              <div className="space-y-4 max-w-3xl mx-auto">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-700 ${
                      skillsRevealed.includes(index)
                        ? "border-[#cd7f32]/50 bg-[#cd7f32]/10 transform translate-x-0 opacity-100 scale-100"
                        : "border-gray-600/30 bg-gray-800/30 transform translate-x-8 opacity-30 scale-95"
                    }`}
                  >
                    <div className="text-3xl">{skill.icon}</div>
                    <div className="text-lg font-medium text-gray-100 flex-1">
                      {skill.text}
                    </div>
                    {skillsRevealed.includes(index) && (
                      <div className="text-[#cd7f32] animate-pulse">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-[#cd7f32]/50 text-[#cd7f32] rounded-lg hover:bg-[#cd7f32]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Ready to Learn! ✨
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Choose Learning Path */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in-50 duration-700">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-[#cd7f32] mb-2">
                  Choose Your Path
                </h3>
                <p className="text-gray-300 text-lg">
                  Select the approach that matches your experience
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {paths.map((path) => (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedPath === path.id
                        ? "border-[#cd7f32] bg-[#cd7f32]/10 shadow-lg shadow-[#cd7f32]/30 scale-105"
                        : "border-gray-600/30 bg-[#1a1a1a] hover:border-[#cd7f32]/50"
                    }`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-5xl">{path.icon}</div>
                      <h4 className="text-xl font-bold text-[#cd7f32]">
                        {path.title}
                      </h4>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          path.difficulty === "Beginner"
                            ? "bg-green-500/20 text-green-300"
                            : path.difficulty === "Intermediate"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {path.difficulty}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {path.description}
                      </p>

                      {selectedPath === path.id && (
                        <div className="text-[#cd7f32] animate-pulse">
                          <CheckCircle className="w-6 h-6 mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-[#cd7f32]/50 text-[#cd7f32] rounded-lg hover:bg-[#cd7f32]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedPath}
                  className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    Choose Warrior Class
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: NEW - Warrior Class Selection */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in-50 duration-700">
              <div className="text-center">
                <div className="text-5xl mb-4">⚔️🧬</div>
                <h3 className="text-3xl font-bold text-[#cd7f32] mb-2">
                  Choose Your Warrior Class
                </h3>
                <p className="text-gray-300 text-lg">
                  Each class has unique combat traits and stat distributions
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  ⚡ Stats and appearance are randomly generated by Magicblock
                  VRF
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {Object.entries(WARRIOR_CLASS_INFO).map(
                  ([classKey, classInfo]) => {
                    const warriorClass = classKey as WarriorClass;
                    const isSelected = selectedClass === warriorClass;

                    return (
                      <div
                        key={classKey}
                        onClick={() => setSelectedClass(warriorClass)}
                        className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? "border-[#cd7f32] bg-[#cd7f32]/10 shadow-lg shadow-[#cd7f32]/30 scale-105"
                            : "border-gray-600/30 bg-[#1a1a1a] hover:border-[#cd7f32]/50"
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className="text-6xl">{classInfo.icon}</div>
                          <h4 className="text-xl font-bold text-[#cd7f32]">
                            {classInfo.title}
                          </h4>

                          <div className="space-y-3 text-left">
                            <div>
                              <div className="text-sm font-medium text-gray-300 mb-1">
                                Description:
                              </div>
                              <div className="text-xs text-gray-400">
                                {classInfo.description}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-300 mb-1">
                                Combat Style:
                              </div>
                              <div className="text-xs text-gray-400">
                                {classInfo.traits}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-300 mb-1">
                                Stat Range:
                              </div>
                              <div className="text-xs text-gray-400">
                                {classInfo.statDistribution}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-300 mb-1">
                                Special:
                              </div>
                              <div className="text-xs text-[#cd7f32]">
                                {classInfo.specialAbility}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="text-[#cd7f32] animate-pulse">
                              <CheckCircle className="w-6 h-6 mx-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h4 className="text-blue-300 font-bold">Magic VRF </h4>
                </div>
                <div className="text-blue-300 text-sm space-y-1">
                  <p>
                    🎲 Combat stats are randomly generated within class ranges
                  </p>
                  <p>
                    🎨 Warrior appearance is randomly selected from class-themed
                    artwork
                  </p>
                  <p>
                    💎 Image rarity (Common/Uncommon/Rare) determined by cosmic
                    chance
                  </p>
                  <p>⚡ All randomness is provably fair using Magicblock VRF</p>
                </div>
              </div>

              <div className="text-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-[#cd7f32]/50 text-[#cd7f32] rounded-lg hover:bg-[#cd7f32]/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedClass}
                  className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    Forge My Warrior
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Warrior Creation */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in-50 duration-700">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-[#cd7f32] mb-2">
                  Forge Your{" "}
                  {selectedClass
                    ? WARRIOR_CLASS_INFO[selectedClass].title
                    : "Warrior"}
                </h3>
                <p className="text-gray-300">
                  Create your on-chain avatar for the blockchain realm
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Left: Warrior Creation */}
                <div className="space-y-6">
                  {/* Selected Class Display */}
                  {selectedClass && (
                    <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {WARRIOR_CLASS_INFO[selectedClass].icon}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#cd7f32]">
                            {WARRIOR_CLASS_INFO[selectedClass].title} Class
                          </div>
                          <div className="text-sm text-gray-400">
                            {WARRIOR_CLASS_INFO[selectedClass].description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Warrior Name:
                    </label>
                    <input
                      type="text"
                      value={warriorName}
                      onChange={(e) => setWarriorName(e.target.value)}
                      placeholder="Enter your warrior's name..."
                      maxLength={32}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {warriorName.length}/32 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Unique DNA (click dice to randomize):
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={warriorDNA}
                        onChange={(e) =>
                          setWarriorDNA(
                            e.target.value.slice(0, 8).toUpperCase()
                          )
                        }
                        placeholder="DNA"
                        maxLength={8}
                        className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl text-gray-100 placeholder-gray-500 focus:border-[#cd7f32] focus:outline-none focus:ring-2 focus:ring-[#cd7f32]/20 font-mono"
                      />
                      <button
                        onClick={() => setWarriorDNA(generateRandomDNA())}
                        className="px-4 py-3 bg-[#cd7f32]/20 border border-[#cd7f32]/50 rounded-xl text-[#cd7f32] hover:bg-[#cd7f32]/30 transition-colors flex items-center gap-2"
                        title="Click to randomize DNA"
                      >
                        <Dice6 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {warriorDNA.length}/8 characters - This affects visual
                      appearance
                    </p>
                  </div>

                  {/* Warrior Preview */}
                  <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#cd7f32] mb-4 text-center">
                      Warrior Preview
                    </h4>

                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-xl border-2 border-[#cd7f32]/50 bg-gradient-to-br from-[#cd7f32]/20 to-[#ff8c42]/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              {selectedClass
                                ? WARRIOR_CLASS_INFO[selectedClass].icon
                                : "⚔️"}
                            </div>
                            <div className="text-xs text-gray-400">
                              Image randomly
                            </div>
                            <div className="text-xs text-gray-400">
                              generated by VRF
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#cd7f32] rounded-full flex items-center justify-center text-black">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="text-lg font-bold text-[#cd7f32]">
                        {warriorName || "Unnamed Warrior"}
                      </div>

                      <div className="bg-[#0f0f0f] p-3 rounded-lg border border-[#cd7f32]/20">
                        <div className="text-sm text-gray-300 space-y-1">
                          <div className="text-[#cd7f32] font-mono">
                            DNA: {warriorDNA || "XXXXXXXX"}
                          </div>
                          <div className="text-gray-400">
                            Class:{" "}
                            {selectedClass
                              ? WARRIOR_CLASS_INFO[selectedClass].title
                              : "None"}
                          </div>
                        </div>
                        {isConnected ? (
                          <div className="text-green-400 mt-2 text-center flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Ready for blockchain creation!
                          </div>
                        ) : (
                          <div className="text-yellow-300 mt-2 text-center flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {authenticated
                              ? "Create or connect a wallet to save permanently"
                              : "Sign in and connect wallet to save permanently"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Code Preview */}
                <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-xl overflow-hidden">
                  <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#cd7f32]/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-4 text-gray-400 text-sm">
                        warrior_struct.rs
                      </span>
                    </div>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto text-gray-300 h-80 overflow-y-auto">
                    <code>
                      {generateWarriorAccountCode(
                        warriorName,
                        warriorDNA,
                        selectedClass
                      )}
                    </code>
                  </pre>

                  <div className="bg-[#1a1a1a] p-4 border-t border-[#cd7f32]/30">
                    <div className="text-xs text-gray-400 space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isConnected ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                        <span>
                          {isConnected
                            ? `Connected to Solana via ${walletName}`
                            : "Demo Mode - No blockchain interaction"}
                        </span>
                      </div>
                      <div className="text-[#cd7f32] font-mono text-xs">
                        VRF will determine stats and image within 30-60 seconds!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VRF Progress Display */}
              {isCreatingWarrior && (
                <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl p-6 max-w-2xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="text-lg font-bold text-[#cd7f32]">
                      Forging Your Warrior
                    </div>

                    <div className="w-full bg-[#0f0f0f] h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] transition-all duration-500 ease-out"
                        style={{ width: `${vrfStage.progress}%` }}
                      />
                    </div>

                    <div className="text-sm text-gray-300">{vrfMessage}</div>

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

              {/* Error/Success Messages */}
              {creationError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{creationError}</p>
                  </div>
                </div>
              )}

              {creationSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-300">
                      ✨ Warrior successfully forged on Solana blockchain!
                    </p>
                  </div>
                  {createdWarrior && (
                    <div className="mt-3 text-sm text-green-200 space-y-1">
                      <div>
                        ⚔️ ATK: {createdWarrior.baseAttack} | 🛡️ DEF:{" "}
                        {createdWarrior.baseDefense} | 🧠 KNOW:{" "}
                        {createdWarrior.baseKnowledge}
                      </div>
                      <div>🎨 Rarity: {createdWarrior.imageRarity}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-[#cd7f32]/50 text-[#cd7f32] rounded-lg hover:bg-[#cd7f32]/10 transition-colors"
                >
                  Back
                </button>

                {isConnected ? (
                  <button
                    onClick={handleCreateWarrior}
                    disabled={
                      !warriorName.trim() ||
                      !warriorDNA ||
                      warriorDNA.length !== 8 ||
                      !selectedClass ||
                      isCreatingWarrior ||
                      creationSuccess
                    }
                    className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-3">
                      {isCreatingWarrior ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                      {isCreatingWarrior
                        ? "Forging on Solana..."
                        : "Forge My Warrior"}
                      {!isCreatingWarrior && (
                        <span className="group-hover:animate-spin">⚡</span>
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-yellow-300 text-sm">
                      {authenticated
                        ? "Create or connect a Solana wallet to save your warrior permanently on-chain"
                        : "Sign in and connect your Solana wallet to save your warrior permanently on-chain"}
                    </p>
                    <button
                      onClick={nextStep}
                      className="group bg-gray-600 hover:bg-gray-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300"
                    >
                      Continue in Demo Mode
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Journey Complete */}
          {currentStep === 6 && (
            <div className="text-center space-y-8 animate-in fade-in-50 duration-700">
              <div className="space-y-6">
                <h3 className="text-4xl font-bold text-[#cd7f32]">
                  Adventure Awaits!
                </h3>
                <p className="text-2xl text-gray-300">
                  Welcome,{" "}
                  <span className="text-[#cd7f32] font-bold">
                    {paths.find((p) => p.id === selectedPath)?.title ||
                      "Blockchain Explorer"}
                  </span>
                  !
                </p>

                <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-xl p-6 max-w-lg mx-auto">
                  <h4 className="text-lg font-bold text-[#cd7f32] mb-4">
                    Your Profile
                  </h4>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Warrior:</span>
                      <span className="text-[#cd7f32] font-medium">
                        {warriorName || "Unnamed"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Class:</span>
                      <span className="text-[#cd7f32]">
                        {selectedClass
                          ? WARRIOR_CLASS_INFO[selectedClass].title
                          : "Validator"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">DNA:</span>
                      <span className="text-[#cd7f32] font-mono">
                        {warriorDNA}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Path:</span>
                      <span className="text-[#cd7f32]">
                        {paths.find((p) => p.id === selectedPath)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rarity</span>
                      {createdWarrior && (
                        <span
                          className={
                            isConnected && creationSuccess
                              ? "text-green-400"
                              : "text-yellow-400"
                          }
                        >
                          {createdWarrior?.imageRarity}
                        </span>
                      )}
                    </div>

                    {isConnected && walletAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Wallet:</span>
                        <span className="text-green-400 text-sm font-mono">
                          {walletAddress.slice(0, 6)}...
                          {walletAddress.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Warrior Card with Flip Animation */}
                {createdWarrior && (
                  <div className="flex justify-center">
                    <WarriorCard
                      warrior={createdWarrior}
                      selectedClass={selectedClass}
                      warriorName={warriorName}
                    />
                  </div>
                )}

                {isConnected && creationSuccess ? (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Crown className="w-6 h-6 text-green-400" />
                      <h4 className="text-green-300 font-bold">
                        Blockchain Success!
                      </h4>
                    </div>
                    <p className="text-green-300 text-sm">
                      🎉 Your Undead Warrior is now permanently stored on
                      Solana! Your learning progress will be tracked on the
                      blockchain forever.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Globe className="w-6 h-6 text-blue-400" />
                      <h4 className="text-blue-300 font-bold">
                        Ready to Learn!
                      </h4>
                    </div>
                    <p className="text-blue-300 text-sm">
                      💡{" "}
                      {authenticated
                        ? "Create or connect a wallet anytime to save your progress permanently on the blockchain!"
                        : "Sign in and connect your wallet anytime to save your progress permanently on the blockchain!"}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleComplete}
                className="group bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-xl px-12 py-6 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-[#cd7f32]/50"
              >
                <span className="flex items-center gap-4">
                  <Brain className="w-6 h-6" />
                  Enter the Learning Academy
                  <span className="group-hover:animate-spin">⚡</span>
                </span>
              </button>

              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  >
                    {
                      ["🧠", "⚡", "🌐", "💎", "🔥"][
                        Math.floor(Math.random() * 5)
                      ]
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation - Always visible */}
        {currentStep > 1 && currentStep < 6 && (
          <div className="flex justify-between items-center p-6 bg-[#1a1a1a] border-t border-[#cd7f32]/30 flex-shrink-0">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#cd7f32] transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i + 1 <= currentStep ? "bg-[#cd7f32]" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {currentStep < 5 && (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 3 && !selectedPath) ||
                  (currentStep === 4 && !selectedClass)
                }
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#cd7f32] transition-colors disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cd7f32;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8c42;
        }

        @keyframes fade-in-50 {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in-50 {
          animation-name: fade-in-50;
        }

        .zoom-in-95 {
          animation-name: zoom-in-95;
        }

        .duration-300 {
          animation-duration: 300ms;
        }

        .duration-700 {
          animation-duration: 700ms;
        }
      `}</style>
    </div>
  );
};

export default OnboardingModal;
