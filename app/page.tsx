"use client";
import { useState, useEffect } from "react";
import {
  Sword,
  Zap,
  Trophy,
  Code,
  ChevronRight,
  Clock,
  Globe,
  Star,
  Target,
  Loader2,
  User,
  AlertCircle,
  Wallet,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Check,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useGameData } from "../hooks/useGameData";
import OnboardingModal from "./components/modal/Onboarding";
import Notification from "./components/Notification";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

// Types
interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  desc: string;
}
interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
  color: string;
}

interface LearningStep {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  completed: boolean;
}

interface ErrorState {
  message: string;
  type: "login" | "general";
}

interface SuccessState {
  message: string;
  type: "warrior_created" | "general";
}

const Home: React.FC = () => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] =
    useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  // Privy auth state
  const { authenticated, user, login, logout } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();

  const {
    ready: gameReady,
    authenticated: gameAuthenticated,
    userAddress,
    networkInfo,
    balance,
    balanceError,
    balanceLoading,
    userWarriors,
    fetchBalance,
    hasWarriors,
    loading: gameDataLoading,
    error: gameDataError,
    refreshData,
  } = useGameData();

  const features: Feature[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Understand Solana Fundamentals",
      description:
        "Learn how consensus mechanisms, transactions, and distributed networks actually work",
      highlight: "Core Concepts",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Explore Solana Architecture",
      description:
        "Dive deep into Proof of History, account models, and parallel transaction processing",
      highlight: "System Design",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Interactive Learning Path",
      description:
        "Progress through gamified lessons that make complex technical concepts engaging",
      highlight: "Learn by Playing",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Build Real Applications",
      description:
        "Apply your knowledge by coding programs and deploying to mainnet",
      highlight: "Hands-on Coding",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Earn as You Learn",
      description:
        "Battle other learners and earn NFT warriors that prove your solana mastery",
      highlight: "Play-to-Learn",
      color: "from-pink-500 to-rose-600",
    },
  ];

  // Stats data
  const stats: Stat[] = [
    {
      label: "Transaction Speed",
      value: "400ms",
      icon: <Clock className="w-5 h-5" />,
      desc: "Block time",
    },
    {
      label: "Network Cost",
      value: "$0.0025",
      icon: <Zap className="w-5 h-5" />,
      desc: "Per transaction",
    },
    {
      label: "Global Reach",
      value: "200+",
      icon: <Globe className="w-5 h-5" />,
      desc: "Countries",
    },
    {
      label: "Learn & Earn",
      value: "∞",
      icon: <Star className="w-5 h-5" />,
      desc: "Potential",
    },
  ];

  // Learning path data
  const learningPath: LearningStep[] = [
    {
      step: "01",
      title: "Fundamentals",
      description:
        "Understand how blockchains work, consensus mechanisms, and distributed systems",
      icon: <Globe className="w-6 h-6" />,
      duration: "1-2 weeks",
      completed: false,
    },
    {
      step: "02",
      title: "Solana Deep Dive",
      description:
        "Explore Proof of History, account models, and Solana's unique architecture",
      icon: <Zap className="w-6 h-6" />,
      duration: "2-3 weeks",
      completed: false,
    },
    {
      step: "03",
      title: "Programs Development",
      description: "Learn and build your first on-chain program",
      icon: <Code className="w-6 h-6" />,
      duration: "4-6 weeks",
      completed: false,
    },
    {
      step: "04",
      title: "Deploy & Battle",
      description: "Launch and compete with developers worldwide",
      icon: <Trophy className="w-6 h-6" />,
      duration: "Ongoing",
      completed: false,
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Handle game data errors
  useEffect(() => {
    if (gameDataError) {
      setError({
        message: gameDataError,
        type: "general",
      });
    }
  }, [gameDataError]);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  const handleLogin = async () => {
    try {
      setError(null);
      setSuccess(null);
      login();
    } catch (err) {
      console.error("Login failed:", err);
      setError({
        message: "Failed to sign in. Please try again.",
        type: "login",
      });
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      setSuccess(null);
      solanaWallets.map((wallet) => {
        wallet.disconnect;
      });
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      setError({
        message: "Failed to sign out. Please try again.",
        type: "general",
      });
    }
  };

  // Open onboarding modal
  const handleGetStarted = (): void => {
    setShowOnboardingModal(true);
    setError(null);
    setSuccess(null);
  };

  // Navigate to dashboard
  const handleGoToDashboard = (): void => {
    router.push("/headquaters");
    console.log("Navigate to dashboard");
  };

  const handleOnboardingComplete = async (data?: {
    selectedPath?: string;
    warriorName?: string;
    warriorDNA?: string;
    creationSuccess?: boolean;
  }) => {
    setShowOnboardingModal(false);

    if (data?.creationSuccess) {
      setSuccess({
        message: `🎉 Warrior "${data.warriorName}" successfully forged on Solana!`,
        type: "warrior_created",
      });
      try {
        await refreshData();
      } catch (err) {
        console.error("Failed to refresh after warrior creation:", err);
        setError({
          message:
            "Warrior created but failed to refresh data. Please reload the page.",
          type: "general",
        });
      }

      // Auto-navigate to dashboard
      setTimeout(() => {
        handleGoToDashboard();
      }, 3000);
    } else {
      setSuccess({
        message:
          "Welcome to Rust Undead! Ready to start your learning journey.",
        type: "general",
      });
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const clearSuccess = (): void => {
    setSuccess(null);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) {
      setNotification({
        message: "No address to copy",
        status: "error",
        show: true,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setNotification({
        message: "Address copied to clipboard!",
        status: "success",
        show: true,
      });
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      setNotification({
        message: "Failed to copy address",
        status: "error",
        show: true,
      });
    }
  };
  // Error display component
  const ErrorDisplay: React.FC<{ error: ErrorState }> = ({ error }) => (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <p className="text-red-300 text-sm">{error.message}</p>
        <button
          onClick={clearError}
          className="ml-auto text-red-400 hover:text-red-300 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );

  // Success display component
  const SuccessDisplay: React.FC<{ success: SuccessState }> = ({ success }) => (
    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <p className="text-green-300 text-sm">{success.message}</p>
        <button
          onClick={clearSuccess}
          className="ml-auto text-green-400 hover:text-green-300 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );

  // Simple user info display component
  const UserInfo: React.FC = () => {
    if (!authenticated || !user) return null;

    return (
      <div className="fixed top-4 right-4 z-40 bg-[#2a2a2a]/90 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-4 min-w-[280px] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#cd7f32]" />
            <span className="text-sm font-medium text-gray-300">
              Welcome commander!
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* User email/info */}
        {user.google?.email && (
          <div className="text-xs text-gray-400 mb-2 truncate">
            {user.google.name}
          </div>
        )}

        {userAddress && (
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => copyToClipboard(userAddress)}
              className="flex items-center gap-2 p-1 rounded hover:bg-[#cd7f32]/10 transition-all duration-200 group"
              title={copiedAddress ? "Copied!" : "Click to copy address"}
            >
              <Wallet className="w-4 h-4 text-[#cd7f32]" />
              <span className="text-xs text-gray-300 font-mono group-hover:text-[#cd7f32] transition-colors">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
              {copiedAddress ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400 group-hover:text-[#cd7f32] opacity-0 group-hover:opacity-100 transition-all" />
              )}
            </button>

            {/* Network badge */}
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-400" />
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${networkInfo.bgColor} ${networkInfo.borderColor} border ${networkInfo.color} font-medium`}
              >
                {networkInfo.name}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAuthSection = (): React.ReactNode => {
    if (!gameReady) {
      return (
        <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-6 h-6 text-[#cd7f32] animate-spin" />
            <h3 className="text-lg font-bold text-[#cd7f32]">Initializing</h3>
          </div>
          <p className="text-gray-300 text-center">
            Preparing your blockchain adventure...
          </p>
        </div>
      );
    }

    // User not authenticated
    if (!gameAuthenticated) {
      return (
        <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-6 max-w-2xl mx-auto">
          {error && <ErrorDisplay error={error} />}
          {success && <SuccessDisplay success={success} />}

          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-6 h-6 text-[#cd7f32]" />
            <h3 className="text-lg font-bold text-[#cd7f32]">
              Ready to Begin?
            </h3>
          </div>
          <p className="text-gray-300 text-center mb-6">
            Sign in with Google, connect your wallet, or create a new embedded
            wallet to start forging undead warriors and mastering Solana.
          </p>

          <button
            onClick={handleLogin}
            disabled={!gameReady}
            className="w-full bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            Sign In / Connect Wallet
          </button>
        </div>
      );
    }

    if (gameDataLoading) {
      return (
        <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/50 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-6 h-6 text-[#cd7f32] animate-spin" />
            <h3 className="text-lg font-bold text-[#cd7f32]">
              Scanning the Blockchain
            </h3>
          </div>
          <p className="text-gray-300 text-center">
            Searching for your undead warriors across the Solana network...
          </p>
        </div>
      );
    }

    if (hasWarriors) {
      return (
        <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/50 rounded-xl p-6 max-w-2xl mx-auto">
          {success && <SuccessDisplay success={success} />}
          {error && <ErrorDisplay error={error} />}

          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-[#cd7f32]" />
            <h3 className="text-lg font-bold text-[#cd7f32]">
              Welcome Back, Commander!
            </h3>
          </div>
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Found{" "}
              <span className="text-[#cd7f32] font-bold">
                {userWarriors.length}
              </span>{" "}
              warrior{userWarriors.length !== 1 ? "s" : ""} in your undead army.
            </p>
            <p className="text-gray-400 text-sm">
              Ready to continue your blockchain mastery journey?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                Enter Command Center
              </button>
              <button
                onClick={handleGetStarted}
                className="border border-[#cd7f32]/50 text-[#cd7f32] hover:bg-[#cd7f32]/10 font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer"
              >
                <Sword className="w-4 h-4" />
                Forge Another Warrior
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-green-500/50 rounded-xl p-6 max-w-2xl mx-auto">
        {error && <ErrorDisplay error={error} />}
        {success && <SuccessDisplay success={success} />}

        <div className="flex items-center justify-center gap-3 mb-4">
          <Sword className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Ready to Forge</h3>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-300">
            Welcome to Rust Undead! Your{" "}
            {userAddress ? "wallet is connected" : "account is ready"}.
          </p>
          <p className="text-gray-400 text-sm">
            Time to forge your first undead warrior and begin your learning
            journey.
          </p>

          {/* SOL Balance - moved outside the button area */}
          {userAddress && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#1a1a1a]/50 rounded-lg border border-[#cd7f32]/20">
              <div className="w-4 h-4 flex items-center justify-center">
                {balanceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#cd7f32]" />
                ) : balance !== null && balance < 0.01 ? (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                ) : (
                  <span className="text-[#cd7f32]  text-sm  font-bold">
                    Bal
                  </span>
                )}
              </div>

              <div className="flex-1 text-center">
                {balanceError ? (
                  <span className="text-sm text-red-400">
                    Balance unavailable
                  </span>
                ) : balance !== null ? (
                  <div>
                    <span
                      className={`text-sm font-mono ${
                        balance < 0.01 ? "text-orange-400" : "text-gray-300"
                      }`}
                    >
                      {balance < 0.001
                        ? balance.toFixed(6)
                        : balance < 1
                        ? balance.toFixed(4)
                        : balance.toFixed(3)}{" "}
                      SOL
                    </span>
                    {balance < 0.01 && (
                      <div className="text-xs text-orange-400 mt-1">
                        Low balance - you may need more SOL for transactions.
                      </div>
                    )}
                    {balance < 0.01 && networkInfo.name === "Devnet" && (
                      <div className="text-xs text-white font-black mt-1">
                        <Link href="https://faucet.solana.com/">
                          Click to get Devnet SOl
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    Loading balance...
                  </span>
                )}
              </div>

              {/* Refresh balance button */}
              {!balanceLoading && (
                <button
                  onClick={fetchBalance}
                  className="p-1 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded transition-all duration-200"
                  title="Refresh balance"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Forge Warrior Button */}
          <button
            onClick={handleGetStarted}
            disabled={
              showOnboardingModal || (balance !== null && balance < 0.005)
            }
            className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sword className="w-5 h-5" />
            Forge Your First Warrior
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Low balance warning */}
          {balance !== null && balance < 0.005 && (
            <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-300">
                ⚠️ Insufficient SOL balance. You need at least 0.005 SOL to
                create a warrior.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      <UserInfo />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cd7f32]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff8c42]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/30 to-[#ff8c42]/30 rounded-full blur-xl animate-pulse"></div>

                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-[#cd7f32]/50 shadow-2xl group-hover:scale-105 group-hover:border-[#cd7f32] transition-all duration-500 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                  {/* Warrior image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/main.png"
                      alt="Rust Undead"
                      width={200}
                      height={200}
                      priority
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#cd7f32]/20 via-transparent to-transparent"></div>
                </div>

                <div className="absolute -top-4 -right-4 w-3 h-3 bg-[#cd7f32] rounded-full animate-bounce delay-100"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#ff8c42] rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/4 -left-6 w-1.5 h-1.5 bg-[#cd7f32] rounded-full animate-pulse delay-500"></div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#cd7f32] via-[#ff8c42] to-[#cd7f32] bg-clip-text text-transparent leading-tight">
              Rust Undead
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed px-4">
              Master Solana from the ground up - start with fundamentals, end
              with code
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-[#cd7f32] mb-8 font-medium">
              "Knowledge Feeds the Undead Mind" - Understand how Solana really
              works through interactive gameplay
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/20 rounded-lg p-4 hover:border-[#cd7f32]/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-[#cd7f32]">{stat.icon}</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#cd7f32]">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500">{stat.desc}</div>
                </div>
              ))}
            </div>

            {renderAuthSection()}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#cd7f32] mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              From blockchain concepts to production code - learn through
              interactive gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {learningPath.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-[#2a2a2a] border border-[#cd7f32]/20 hover:border-[#cd7f32]/50 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-[#cd7f32]">
                      {step.step}
                    </div>
                    <div className="p-2 rounded-lg bg-[#cd7f32]/20 text-[#cd7f32]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{step.duration}</span>
                  </div>
                </div>

                {/* Connector line */}
                {index < learningPath.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#cd7f32] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#cd7f32] mb-4">
              Why Gamified Learning Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Master complex blockchain concepts through engaging, interactive
              gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-[#2a2a2a] border border-[#cd7f32]/20 rounded-xl p-6 sm:p-8 hover:border-[#cd7f32]/50 transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden ${
                  activeFeature === index ? "ring-2 ring-[#cd7f32]/30" : ""
                }`}
              >
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg bg-gradient-to-r ${feature.color}`}
                >
                  {feature.highlight}
                </div>
                <div className="text-[#cd7f32] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-t from-[#1a1a1a] to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#cd7f32]">
            Ready to Master Solana?
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join learners worldwide mastering blockchain fundamentals through
            interactive gameplay
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-[#cd7f32] mb-3">
                Learn Through Play
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complex blockchain concepts become engaging through gamified
                lessons. Understand consensus mechanisms by battling warriors.
              </p>
            </div>

            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-6">
              <div className="text-3xl mb-4">💀</div>
              <h3 className="text-lg font-bold text-[#cd7f32] mb-3">
                Knowledge Feeds
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your undead warriors crave blockchain knowledge. Feed them
                concepts to make them stronger and win more battles.
              </p>
            </div>

            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm border border-[#cd7f32]/30 rounded-xl p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-[#cd7f32] mb-3">
                Real Application
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Apply your knowledge by building actual blockchain applications.
                Theory meets practice on the world's fastest blockchain.
              </p>
            </div>
          </div>

          {gameAuthenticated && !hasWarriors && !gameDataLoading && (
            <div className="bg-gradient-to-r from-[#cd7f32]/20 to-[#ff8c42]/20 border border-[#cd7f32]/50 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#cd7f32] mb-4">
                Your Journey Awaits! 🚀
              </h3>
              <p className="text-gray-300 mb-6">
                You're all set up! Click below to forge your first warrior and
                begin mastering Solana.
              </p>
              <button
                onClick={handleGetStarted}
                disabled={showOnboardingModal}
                className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <Sword className="w-6 h-6" />
                  Start Your Adventure Now!
                  <ChevronRight className="w-5 h-5" />
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-[#cd7f32]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-[#cd7f32]">
                  Rust Undead
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Master blockchain technology from the ground up through
                engaging, interactive gameplay. Start with concepts, end with
                code - no prior experience required.
              </p>
            </div>
          </div>

          <div className="border-t border-[#cd7f32]/20 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                Built with ❤️ Love and ⚡ Solana | Learn blockchain concepts
                through gameplay
              </p>
              <div className="flex items-center gap-4">
                <p className="text-[#cd7f32] text-sm font-medium">
                  Rust Undead © 2025
                </p>
                {hasWarriors && (
                  <button
                    onClick={handleGoToDashboard}
                    className="text-xs bg-[#cd7f32]/20 text-[#cd7f32] px-3 py-1 rounded-full hover:bg-[#cd7f32]/30 transition-colors"
                  >
                    Dashboard →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {notification.show && (
          <Notification
            message={notification.message}
            status={notification.status}
            switchShowOff={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
