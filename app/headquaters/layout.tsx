"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Sword,
  Trophy,
  BookOpen,
  Link,
  Shield,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  LogOut,
  Menu,
  Activity,
  User,
  Wallet,
  Globe,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { usePrivy } from "@privy-io/react-auth";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
}

interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

// Create a context for navigation
interface NavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();

  // Privy hooks
  const { ready, authenticated, user, logout } = usePrivy();

  // Game data hook
  const {
    userProfile,
    userWarriors,
    refreshData,
    isConnected,
    userAddress,
    balance,
    balanceLoading,
    balanceError,
    fetchBalance,
    networkInfo,
  } = useGameData();

  // Navigation state
  const [activeSection, setActiveSection] = useState("dashboard");

  // Local state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "warriors", label: "My Warriors", icon: Sword },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "battle", label: "Battle Arena", icon: Shield, comingSoon: true },
    { id: "academy", label: "Rust Academy", icon: BookOpen, comingSoon: true },
    { id: "forge", label: "Solana Forge", icon: Link, comingSoon: true },
  ];

  // Authentication guard - redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated && !isRedirecting) {
      setIsRedirecting(true);
      console.log("User not authenticated, redirecting to home...");
      router.push("/");
    }
  }, [ready, authenticated, router, isRedirecting]);

  // Connection guard - redirect if authenticated but not connected
  useEffect(() => {
    if (ready && authenticated && !isConnected && !isRedirecting) {
      setIsRedirecting(true);
      console.log(
        "User authenticated but not connected, redirecting to home..."
      );
      router.push("/");
    }
  }, [ready, authenticated, isConnected, router, isRedirecting]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("mobile-sidebar");
        const menuButton = document.getElementById("mobile-menu-button");

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

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

  // Format balance for display
  const formatBalance = (bal: number): string => {
    if (bal < 0.001) return bal.toFixed(6);
    if (bal < 1) return bal.toFixed(4);
    return bal.toFixed(3);
  };

  // Check if balance is low
  const isLowBalance = balance !== null && balance < 0.01;

  const playSound = (type: string) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const createTone = (
        frequency: number,
        duration: number,
        type: "sine" | "square" | "sawtooth" = "sine"
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      switch (type) {
        case "click":
          createTone(800, 0.1);
          break;
        case "hover":
          createTone(600, 0.05);
          break;
      }
    } catch (error) {
      console.warn("Audio context not supported:", error);
    }
  };

  const handleNavigation = (sectionId: string) => {
    console.log(`Navigating to section: ${sectionId}`);

    const navItem = navigationItems.find((item) => item.id === sectionId);
    if (navItem?.comingSoon) {
      setNotification({
        message: `${navItem.label} coming soon!`,
        status: "error",
        show: true,
      });
      return;
    }

    setActiveSection(sectionId);
    playSound("click");

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsRedirecting(true);
      await logout();
      setNotification({
        message: "Successfully disconnected. Redirecting...",
        status: "success",
        show: true,
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Failed to disconnect:", error);
      setIsRedirecting(false);
      setNotification({
        message: "Failed to disconnect. Please try again.",
        status: "error",
        show: true,
      });
    }
  };

  const getSectionTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      warriors: "My Warriors",
      battle: "Battle Arena",
      achievements: "Achievements",
      academy: "Rust Academy",
      forge: "Solana Forge",
    };
    return titles[activeSection as keyof typeof titles] || "Dashboard";
  };

  const getSectionDescription = () => {
    const descriptions = {
      dashboard: "Welcome back, Commander",
      warriors: "Manage your immortal legion",
      battle: "Fight for glory and experience",
      achievements: "Track your legendary accomplishments",
      academy: "Learn blockchain fundamentals",
      forge: "Create and deploy smart contracts",
    };
    return descriptions[activeSection as keyof typeof descriptions] || "";
  };

  // Show loading state while checking authentication or redirecting
  if (!ready || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#cd7f32] mx-auto" />
          <p className="text-gray-300 text-lg">
            {isRedirecting ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized state if not authenticated or connected
  if (!authenticated || !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl font-bold text-[#cd7f32]">Access Denied</h1>
          <p className="text-gray-300">
            You need to be connected to access the dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#cd7f32] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#cd7f32] text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // User info component with Privy integration
  const UserInfoSection = () => {
    if (!authenticated || !user) return null;

    return (
      <div className="space-y-3 mb-4">
        {/* User Identity */}
        {user.google?.name && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#cd7f32]" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-300 truncate">
                {user.google.name}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Address with Network */}
        {userAddress && (
          <div className="space-y-2">
            {/* Address */}
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#cd7f32]" />
              <span className="text-xs text-gray-300 font-mono flex-1">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
              <button
                onClick={() => copyToClipboard(userAddress)}
                className="p-1 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded transition-all duration-200"
                title={copiedAddress ? "Copied!" : "Copy address"}
              >
                {copiedAddress ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Balance */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                {balanceLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#cd7f32]" />
                ) : isLowBalance ? (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                ) : (
                  <span className="text-[#cd7f32] text-xs font-bold">◉</span>
                )}
              </div>
              <div className="flex-1">
                {balanceError ? (
                  <span className="text-xs text-red-400">
                    Balance unavailable
                  </span>
                ) : balance !== null ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono ${
                        isLowBalance ? "text-orange-400" : "text-gray-300"
                      }`}
                    >
                      {formatBalance(balance)} SOL
                    </span>
                    {isLowBalance && (
                      <span className="text-xs text-orange-400">Low</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Loading...</span>
                )}
              </div>
              {!balanceLoading && (
                <button
                  onClick={fetchBalance}
                  className="p-1 text-gray-400 hover:text-[#cd7f32] hover:bg-[#cd7f32]/10 rounded transition-all duration-200"
                  title="Refresh balance"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex">
        {/* Notification Toast */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div
              className={`p-4 rounded-lg border shadow-lg ${
                notification.status === "success"
                  ? "bg-green-900/90 border-green-500/50 text-green-100"
                  : "bg-red-900/90 border-red-500/50 text-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.status === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="text-sm">{notification.message}</span>
                <button
                  onClick={() =>
                    setNotification((prev) => ({ ...prev, show: false }))
                  }
                  className="ml-auto text-current hover:opacity-70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" />
        )}

        {/* Left Sidebar */}
        <div
          id="mobile-sidebar"
          className={`
            ${isMobile ? "fixed" : "relative"} 
            ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
            w-72 bg-[#1a1a1a] border-r border-[#cd7f32]/30 flex flex-col z-40 transition-transform duration-300 ease-in-out
          `}
        >
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 border-b border-[#cd7f32]/30">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-xl font-bold text-[#cd7f32]">
                  Command Center
                </h1>
                {/* Control Buttons */}
                <div className="flex">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10"
                    title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={isRedirecting}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Disconnect Wallet"
                  >
                    {isRedirecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Close Button */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* User Info Section */}
            <UserInfoSection />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  onMouseEnter={() => playSound("hover")}
                  disabled={item.comingSoon}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 relative ${
                    activeSection === item.id
                      ? "bg-[#cd7f32]/20 text-[#cd7f32] border border-[#cd7f32]/50 shadow-lg"
                      : item.comingSoon
                      ? "text-gray-500 cursor-not-allowed opacity-50"
                      : "text-gray-300 hover:bg-[#cd7f32]/10 hover:text-[#cd7f32] hover:border hover:border-[#cd7f32]/30"
                  }`}
                >
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg ${
                      activeSection === item.id
                        ? "bg-[#cd7f32]/30"
                        : "bg-[#2a2a2a]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-medium flex-1 text-left text-sm sm:text-base">
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                  {activeSection === item.id && !item.comingSoon && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer Stats */}
          <div className="p-4 sm:p-6 border-t border-[#cd7f32]/30 bg-[#0f0f0f]">
            <div className="text-sm space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Warriors:</span>
                <span className="text-[#cd7f32] font-bold">
                  {userWarriors.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Battles:</span>
                <span className="text-[#cd7f32] font-bold">
                  {userProfile?.totalBattlesFought || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wins:</span>
                <span className="text-[#cd7f32] font-bold">
                  {userProfile?.totalBattlesWon || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-[#1a1a1a] border-b border-[#cd7f32]/30 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <button
                    id="mobile-menu-button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10 lg:hidden"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#cd7f32] mb-1 sm:mb-2">
                    {getSectionTitle()}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                    {getSectionDescription()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-gray-400">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                {/* Network */}
                {networkInfo && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#cd7f32]" />
                    <span className="text-xs text-gray-400">Network:</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${networkInfo.bgColor} ${networkInfo.borderColor} border ${networkInfo.color} font-medium`}
                    >
                      {networkInfo.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={refreshData}
                  className="p-2 sm:p-3 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10"
                  title="Refresh Data"
                >
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[calc(100vh-120px)]">{children}</div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

export default DashboardLayout;
