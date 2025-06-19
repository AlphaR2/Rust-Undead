"use client";
import React, { useState, useEffect } from "react";
import { useGameData } from "@/hooks/useGameData";
import { useNavigation } from "./layout";
import DashboardPage from "./dashboard/page";
import Warriors from "./warriors/page";
import Achievements from "./achievements/page";
import WelcomeModal from "../components/modal/WelcomeModal";
import { useTour } from "../components/modal/WelcomeModal";
import { Warrior } from "@/types/undead";

interface DashboardProps {
  newWarriorName?: string;
  newWarriorDNA?: string;
  showWelcome?: boolean;
  onShowWelcome?: (show: boolean) => void;
}

const HeadQuarters: React.FC<DashboardProps> = ({
  newWarriorName,
  newWarriorDNA,
  showWelcome: externalShowWelcome = false,
  onShowWelcome,
}) => {
  const { isConnected, userWarriors } = useGameData();

  // Use the navigation context from layout
  const { activeSection, setActiveSection } = useNavigation();

  // Tour management
  const {
    showWelcome: internalShowWelcome,
    showTour,
    handleCloseWelcome,
    handleStartTour,
    handleCloseTour,
    handleCompleteTour,
  } = useTour();

  // Local state
  const [selectedWarrior, setSelectedWarrior] = useState<Warrior | null>(null);

  // Determine which welcome state to use
  const shouldShowWelcome = externalShowWelcome || internalShowWelcome;

  // Handle navigation between sections
  const handleNavigation = (sectionId: string) => {
    console.log(`HeadQuarters: Navigating to section: ${sectionId}`);
    setActiveSection(sectionId);
  };

  // Handle warrior selection for battles
  const handleBattleSelect = (warrior: any) => {
    setSelectedWarrior(warrior);
    setActiveSection("battle");
  };

  // Handle welcome modal close
  const handleWelcomeClose = () => {
    handleCloseWelcome();
    if (onShowWelcome) {
      onShowWelcome(false);
    }
  };

  // Auto-show welcome for new users
  useEffect(() => {
    if (isConnected && userWarriors.length === 0 && !shouldShowWelcome) {
      if (onShowWelcome) {
        onShowWelcome(true);
      }
    }
  }, [isConnected, userWarriors.length, shouldShowWelcome, onShowWelcome]);

  // Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigation} />;
      case "warriors":
        return (
          <Warriors
            onBattleSelect={handleBattleSelect}
            onNavigate={handleNavigation}
          />
        );
      case "achievements":
        return <Achievements onNavigate={handleNavigation} />;
      case "battle":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6">
                <div className="text-6xl">⚔️</div>
                <h2 className="text-3xl font-bold text-[#cd7f32]">
                  Battle Arena
                </h2>
                <p className="text-gray-300 text-lg">
                  Epic battles await! Test your skills and knowledge against
                  other warriors.
                </p>
                <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-[#cd7f32] mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-gray-300 mb-4">
                    The Battle Arena is under construction. Soon you'll be able
                    to:
                  </p>
                  <ul className="text-left space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-[#cd7f32]">⚔️</span>
                      <span>Challenge other players</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#cd7f32]">🧠</span>
                      <span>Learn through combat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#cd7f32]">🏆</span>
                      <span>Earn battle rewards</span>
                    </li>
                  </ul>
                </div>
                {selectedWarrior && (
                  <div className="mt-6 p-4 bg-[#2a2a2a] border border-[#cd7f32]/50 rounded-lg max-w-sm mx-auto">
                    <h4 className="text-lg font-bold text-[#cd7f32] mb-2">
                      Selected Warrior
                    </h4>
                    <p className="text-gray-300">{selectedWarrior.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "academy":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6">
                <div className="text-6xl">📚</div>
                <h2 className="text-3xl font-bold text-[#cd7f32]">
                  Rust Academy
                </h2>
                <p className="text-gray-300 text-lg">
                  Master blockchain fundamentals through interactive lessons.
                </p>
                <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-[#cd7f32] mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-gray-300">
                    The Academy will teach you Solana concepts through engaging
                    content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "forge":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6">
                <div className="text-6xl">🔨</div>
                <h2 className="text-3xl font-bold text-[#cd7f32]">
                  Solana Forge
                </h2>
                <p className="text-gray-300 text-lg">
                  Create and deploy your own smart contracts on Solana.
                </p>
                <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-[#cd7f32] mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-gray-300">
                    The Forge will let you build and deploy Solana programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4 sm:p-8">
        <div className="text-center space-y-6 sm:space-y-8 max-w-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#cd7f32] mb-4">
            Rust Undead Academy
          </h1>
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Connect your Solana wallet to access your Command Center and begin
              your journey to master blockchain development through epic
              battles.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#cd7f32]/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#cd7f32] mb-3">
              What awaits you:
            </h3>
            <div className="text-left space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-[#cd7f32]">⚔️</span>
                <span>Forge immortal warriors on the blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#cd7f32]">🧠</span>
                <span>Learn Solana concepts through combat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#cd7f32]">🏆</span>
                <span>Earn achievements and legendary titles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#cd7f32]">🔗</span>
                <span>All progress stored permanently on-chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Modal */}
      {shouldShowWelcome && (
        <WelcomeModal
          isOpen={shouldShowWelcome}
          onClose={handleWelcomeClose}
          newWarriorName={newWarriorName}
          newWarriorDNA={newWarriorDNA}
          onStartTour={handleStartTour}
        />
      )}

      {/* Tour Component */}
      {showTour && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f] border-2 border-[#cd7f32]/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Tour content would be rendered here */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-[#cd7f32] mb-4">
                Interactive Tour
              </h2>
              <p className="text-gray-300 mb-6">
                Take a guided tour through all the features of Rust Undead
                Academy
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCloseTour}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleCompleteTour}
                  className="px-6 py-3 bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Start Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderMainContent()}
    </>
  );
};

export default HeadQuarters;
