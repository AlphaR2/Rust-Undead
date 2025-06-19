"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sword,
  Shield,
  Trophy,
  Crown,
  Zap,
  Target,
  Star,
  Globe,
  Brain,
  Play,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Gamepad2,
  GraduationCap,
  Wallet,
  Home,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";


interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPath?: string;
  newWarriorName?: string;
  newWarriorDNA?: string;
  onStartTour?: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface TourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface QuickTourProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}


export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  newWarriorName,
  newWarriorDNA,
}) => {
  const { userAddress, networkInfo, userWarriors } = useGameData();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  const isNewUser = userWarriors.length === 0;

  const welcomeSteps = [
    {
      id: "welcome",
      title: "Welcome to Rust Undead Academy!",
      content: (
        <div className="text-center space-y-6">
          <div className="text-8xl mb-6">🦀💀</div>
          <h2 className="text-3xl font-bold text-[#cd7f32] mb-4">
            Command Center Initialized
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Welcome to the ultimate blockchain gaming experience where you learn{" "}
            <span className="text-[#cd7f32] font-bold">Solana development</span>{" "}
            through epic warrior battles!
          </p>

          {userAddress && (
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Wallet className="w-6 h-6 text-[#cd7f32]" />
                <span className="text-[#cd7f32] font-bold">
                  Connected Wallet
                </span>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono">
                    {userAddress.slice(0, 8)}...{userAddress.slice(-8)}
                  </span>
                </div>
                {networkInfo && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className={`${networkInfo.color} font-medium`}>
                      {networkInfo.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "concept",
      title: "Learn Through Battle",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠⚔️</div>
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-4">
              Educational Combat System
            </h3>
            <p className="text-gray-300 mb-6">
              Master Solana blockchain concepts through strategic warrior combat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-purple-400">
                  Solana Academy
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Master blockchain concepts through interactive lessons before
                each battle
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-green-400" />
                <span className="font-bold text-green-400">
                  Knowledge Bonus
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Correct answers enhance your warrior's battle effectiveness
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-blue-400">Real Blockchain</span>
              </div>
              <p className="text-gray-300 text-sm">
                All warriors and battles are recorded permanently on Solana
              </p>
            </div>

            <div className="bg-[#0f0f0f] border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-yellow-400">Achievements</span>
              </div>
              <p className="text-gray-300 text-sm">
                Unlock titles and rewards as you master Solana development
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "journey",
      title: "Your Learning Journey",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-4">
              {isNewUser ? "Ready to Begin?" : "Continue Your Adventure"}
            </h3>
          </div>

          {isNewUser ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#cd7f32]/20 to-[#ff8c42]/20 border border-[#cd7f32]/50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-[#cd7f32] mb-3 flex items-center gap-2">
                  <Sword className="w-6 h-6" />
                  Step 1: Forge Your First Warrior
                </h4>
                <p className="text-gray-300 mb-4">
                  Create your first undead champion with unique DNA and stats.
                  This warrior will be permanently stored on the Solana
                  blockchain.
                </p>
                {newWarriorName && newWarriorDNA && (
                  <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Pre-configured Warrior:
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#cd7f32] font-bold">
                        {newWarriorName}
                      </span>
                      <span className="text-gray-300 font-mono">
                        {newWarriorDNA}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-lg p-6">
                <h4 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Step 2: Master Solana Concepts
                </h4>
                <p className="text-gray-300 mb-4">
                  Learn through interactive lessons covering validators,
                  transactions, accounts, and more.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple-500/20 rounded px-2 py-1 text-center text-purple-300">
                    RPC Nodes
                  </div>
                  <div className="bg-purple-500/20 rounded px-2 py-1 text-center text-purple-300">
                    PoH
                  </div>
                  <div className="bg-purple-500/20 rounded px-2 py-1 text-center text-purple-300">
                    Accounts
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-6">
                <h4 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Step 3: Enter Battle Arena
                </h4>
                <p className="text-gray-300">
                  Use your knowledge to defeat opponents in strategic combat.
                  Victory records are stored on-chain!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 text-lg mb-6">
                  Welcome back, Commander! Your army awaits your return.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4 text-center">
                  <Sword className="w-8 h-8 text-[#cd7f32] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {userWarriors.length}
                  </div>
                  <div className="text-sm text-gray-400">Warriors</div>
                </div>

                <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {userWarriors.reduce((sum, w) => sum + w.battleWins, 0)}
                  </div>
                  <div className="text-sm text-gray-400">Victories</div>
                </div>

                <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.max(...userWarriors.map((w) => w.powerLevel), 0)}
                  </div>
                  <div className="text-sm text-gray-400">Max Power</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    onClose();
  };

  const handleCompleteTour = () => {
    setShowTour(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#cd7f32]/30">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#cd7f32]" />
              <span className="text-xl font-bold text-[#cd7f32]">
                Welcome to Command Center
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#cd7f32] transition-colors p-2 hover:bg-[#cd7f32]/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-[#cd7f32] scale-125"
                      : index < currentStep
                      ? "bg-[#cd7f32]/60"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="min-h-[400px]">
              {welcomeSteps[currentStep].content}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-[#cd7f32]/30">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#cd7f32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-sm text-gray-400">
              {currentStep + 1} of {welcomeSteps.length}
            </div>

            {currentStep === welcomeSteps.length - 1 ? (
              <div className="flex gap-3">
                <button
                  onClick={handleStartTour}
                  className="flex items-center gap-2 px-6 py-3 bg-[#cd7f32]/20 border border-[#cd7f32]/50 text-[#cd7f32] font-medium rounded-lg hover:bg-[#cd7f32]/30 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Take Tour
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  {isNewUser ? "Begin Adventure" : "Return to Command"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tour Component */}
      {showTour && (
        <Tour
          isOpen={showTour}
          onClose={handleCloseTour}
          onComplete={handleCompleteTour}
        />
      )}
    </>
  );
};

// ============================================================================
// TOUR COMPONENT
// ============================================================================

export const Tour: React.FC<TourProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: "dashboard",
      title: "Command Center Dashboard",
      description:
        "Your mission control for managing warriors and tracking progress",
      icon: Home,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Home className="w-16 h-16 text-[#cd7f32] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              Dashboard Overview
            </h3>
            <p className="text-gray-300 mb-4">
              Your central hub for tracking all game progress and statistics
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-200">Army Statistics</div>
                <div className="text-sm text-gray-400">
                  Track total warriors, victories, and power levels
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-200">Recent Activity</div>
                <div className="text-sm text-gray-400">
                  See your latest warrior creations and battles
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-200">
                  Learning Progress
                </div>
                <div className="text-sm text-gray-400">
                  Monitor your Solana knowledge advancement
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "warriors",
      title: "Warrior Management",
      description: "Create, upgrade, and manage your immortal legion",
      icon: Sword,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Sword className="w-16 h-16 text-[#cd7f32] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              My Warriors
            </h3>
            <p className="text-gray-300 mb-4">
              Forge and manage your blockchain warriors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
              <div className="font-medium text-gray-200 mb-2">
                Forge Warriors
              </div>
              <div className="text-sm text-gray-400">
                Create unique warriors with custom DNA stored permanently on
                Solana blockchain
              </div>
            </div>
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
              <div className="font-medium text-gray-200 mb-2">
                Warrior Stats
              </div>
              <div className="text-sm text-gray-400">
                Track power levels, battle records, and experience points for
                each warrior
              </div>
            </div>
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
              <div className="font-medium text-gray-200 mb-2">Battle Ready</div>
              <div className="text-sm text-gray-400">
                Select warriors for arena combat and educational challenges
              </div>
            </div>
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
              <div className="font-medium text-gray-200 mb-2">
                Blockchain Verified
              </div>
              <div className="text-sm text-gray-400">
                View warrior data on Solana Explorer with permanent on-chain
                records
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "battle",
      title: "Educational Battle Arena",
      description: "Learn Solana concepts through strategic combat",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-[#cd7f32] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              Battle Arena
            </h3>
            <p className="text-gray-300 mb-4">
              Learn through combat - knowledge is your greatest weapon
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-purple-400">
                  Pre-Battle Learning
                </span>
              </div>
              <div className="text-sm text-gray-300">
                Master 5 Solana concepts through interactive slides before each
                battle
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-green-400" />
                <span className="font-bold text-green-400">
                  Knowledge Challenges
                </span>
              </div>
              <div className="text-sm text-gray-300">
                Answer quiz questions during battle for damage bonuses and extra
                XP
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-blue-400">
                  On-Chain Battles
                </span>
              </div>
              <div className="text-sm text-gray-300">
                Victory transactions are recorded permanently on Solana
                blockchain
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "achievements",
      title: "Achievement System",
      description: "Track your progress and unlock legendary titles",
      icon: Trophy,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-[#cd7f32] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              Achievements
            </h3>
            <p className="text-gray-300 mb-4">
              Unlock titles and rewards as you master Solana development
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🥉</div>
              <div className="font-medium text-amber-400">Bronze</div>
              <div className="text-xs text-gray-400">Beginner milestones</div>
            </div>

            <div className="bg-gray-400/20 border border-gray-400/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🥈</div>
              <div className="font-medium text-gray-300">Silver</div>
              <div className="text-xs text-gray-400">Intermediate goals</div>
            </div>

            <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🥇</div>
              <div className="font-medium text-yellow-400">Gold</div>
              <div className="text-xs text-gray-400">Advanced challenges</div>
            </div>

            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-medium text-purple-400">Legendary</div>
              <div className="text-xs text-gray-400">Master level</div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
            <div className="font-medium text-gray-200 mb-2">
              Achievement Categories:
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>
                • <span className="text-[#cd7f32]">Warrior Mastery:</span>{" "}
                Forging and upgrading warriors
              </div>
              <div>
                • <span className="text-[#cd7f32]">Combat Glory:</span> Battle
                victories and streaks
              </div>
              <div>
                • <span className="text-[#cd7f32]">Collection:</span> Power
                levels and experience
              </div>
              <div>
                • <span className="text-[#cd7f32]">Special Events:</span>{" "}
                Blockchain milestones
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "Navigation & Features",
      description: "Master the Command Center interface and tools",
      icon: Gamepad2,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Gamepad2 className="w-16 h-16 text-[#cd7f32] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              Interface Guide
            </h3>
            <p className="text-gray-300 mb-4">
              Navigate the Command Center like a pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-[#cd7f32]" />
                  <span className="font-medium text-gray-200">Wallet Info</span>
                </div>
                <div className="text-xs text-gray-400">
                  View balance, network, and copy your address
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-5 h-5 text-[#cd7f32]" />
                  <span className="font-medium text-gray-200">
                    Blockchain Links
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Direct links to Solana Explorer for verification
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#cd7f32]" />
                  <span className="font-medium text-gray-200">
                    Quick Actions
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Fast access to forge, battle, and achievements
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-[#cd7f32]" />
                  <span className="font-medium text-gray-200">
                    Progress Tracking
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Monitor learning and achievement progress
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#cd7f32]/20 to-[#ff8c42]/20 border border-[#cd7f32]/50 rounded-lg p-4">
            <div className="font-medium text-[#cd7f32] mb-2">💡 Pro Tips:</div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>• Use the refresh button to sync latest blockchain data</div>
              <div>• Copy transaction signatures to share your victories</div>
              <div>• Check achievements regularly for new unlock criteria</div>
              <div>
                • Master concepts in Academy for better battle performance
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "Ready for Battle!",
      description: "You're now equipped to master Solana through epic combat",
      icon: Crown,
      content: (
        <div className="space-y-6 text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-[#cd7f32] mb-4">
            Tour Complete!
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            You're now ready to begin your journey as an undead commander. Forge
            powerful warriors, master Solana concepts, and dominate the
            battlefield!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4">
              <Sword className="w-8 h-8 text-[#cd7f32] mx-auto mb-2" />
              <div className="font-bold text-white">Create Warriors</div>
              <div className="text-xs text-gray-400 mt-1">
                Build your undead army
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-lg p-4">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-bold text-white">Learn Concepts</div>
              <div className="text-xs text-gray-400 mt-1">
                Master Solana development
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-4">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="font-bold text-white">Earn Achievements</div>
              <div className="text-xs text-gray-400 mt-1">
                Unlock legendary titles
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#cd7f32]/20 to-[#ff8c42]/20 border border-[#cd7f32]/50 rounded-lg p-6">
            <h4 className="text-xl font-bold text-[#cd7f32] mb-3">
              🚀 What's Next?
            </h4>
            <div className="text-left space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>
                  Visit the Warriors section to forge your first champion
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Complete Solana Academy lessons before battles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Challenge opponents in the Battle Arena</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Track your progress in Achievements</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#cd7f32]/30">
          <div className="flex items-center gap-3">
            <currentTourStep.icon className="w-8 h-8 text-[#cd7f32]" />
            <div>
              <h2 className="text-xl font-bold text-[#cd7f32]">
                {currentTourStep.title}
              </h2>
              <p className="text-sm text-gray-400">
                {currentTourStep.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#cd7f32] transition-colors p-2 hover:bg-[#cd7f32]/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <span className="text-sm text-[#cd7f32]">
              {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="min-h-[400px]">{currentTourStep.content}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#cd7f32]/30">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#cd7f32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-[#cd7f32] scale-150"
                    : index < currentStep
                    ? "bg-[#cd7f32]/60"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Start Your Journey
              <Crown className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK TOUR COMPONENT
// ============================================================================

export const QuickTour: React.FC<QuickTourProps> = ({
  isOpen,
  onClose,
  sections,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#cd7f32]/30">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-[#cd7f32]" />
            <h2 className="text-xl font-bold text-[#cd7f32]">Quick Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#cd7f32] transition-colors p-2 hover:bg-[#cd7f32]/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#cd7f32] mb-2">
              Command Center Sections
            </h3>
            <p className="text-gray-400">
              Navigate between these key areas to master Solana through gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-[#0f0f0f] border border-[#cd7f32]/30 rounded-lg p-4 hover:border-[#cd7f32]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <section.icon className="w-6 h-6 text-[#cd7f32]" />
                  <h4 className="font-bold text-white">{section.title}</h4>
                </div>
                <p className="text-sm text-gray-400">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-6 border-t border-[#cd7f32]/30">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TOUR MANAGEMENT HOOK
// ============================================================================

export const useTour = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal before
    const hasSeenBefore = localStorage.getItem("rust-undead-welcome-seen");
    if (!hasSeenBefore && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [hasSeenWelcome]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    setHasSeenWelcome(true);
    localStorage.setItem("rust-undead-welcome-seen", "true");
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleCloseTour = () => {
    setShowTour(false);
  };

  const handleCompleteTour = () => {
    setShowTour(false);
    localStorage.setItem("rust-undead-tour-completed", "true");
  };

  const resetTutorial = () => {
    localStorage.removeItem("rust-undead-welcome-seen");
    localStorage.removeItem("rust-undead-tour-completed");
    setHasSeenWelcome(false);
    setShowWelcome(true);
  };

  return {
    showWelcome,
    showTour,
    handleCloseWelcome,
    handleStartTour,
    handleCloseTour,
    handleCompleteTour,
    resetTutorial,
  };
};
