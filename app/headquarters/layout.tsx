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
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useGameData } from "@/hooks/useGameData";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCurrentWallet } from "@/hooks/useUndeadProgram";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
  path: string
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
  const { authenticated, user, logout } = usePrivy();

  // Standard Solana wallet adapter
  const { connected, disconnect, wallet } = useWallet();

  // Enhanced wallet hook
  const {
    address: userAddress,
    type: walletType,
    name: walletName,
    icon: walletIcon,
    isConnected: walletConnected,
    availableWallets,
  } = useCurrentWallet();

  // Game data hook
  const {
    userProfile,
    userWarriors,
    refreshData,
    balance,
    balanceLoading,
    balanceError,
    fetchBalance,
    networkInfo,
    ready: gameReady,
    authenticated: gameAuthenticated,
  } = useGameData();

  // Navigation state
  const [activeSection, setActiveSection] = useState("dashboard");

  // Local state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // New state for desktop collapse
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/headquarters/dashboard",
    },
    {
      id: "warriors",
      label: "My Warriors",
      icon: Sword,
      path: "/headquarters/warriors",
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      path: "/headquarters/achievements",
    },
    {
      id: "battle",
      label: "Battle Arena",
      icon: Shield,
      path: "/headquarters/battle-arena",
    },
    {
      id: "academy",
      label: "Rust Academy",
      icon: BookOpen,
      comingSoon: true,
      path: "/headquarters/academy",
    },
    {
      id: "forge",
      label: "Solana Forge",
      icon: Link,
      comingSoon: true,
      path: "/headquarters/forge",
    },
  ];

  // Check if user is authenticated via either method
  const isUserAuthenticated = gameAuthenticated || connected;

  // Authentication guard - redirect if not authenticated via either method
  useEffect(() => {
    if (gameReady && !isUserAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      console.log("User not authenticated, redirecting to home...");
      router.push("/");
    }
  }, [gameReady, isUserAuthenticated, router, isRedirecting]);

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

  const handleNavigation = (sectionId: string, path: string) => {
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
    router.push(path);
    setActiveSection(sectionId);
    playSound("click");

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDisconnectAll = async () => {
    try {
      setIsRedirecting(true);

      // Disconnect Solana wallet if connected
      if (connected) {
        await disconnect();
      }

      // Logout from Privy if authenticated
      if (authenticated) {
        await logout();
      }

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

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    playSound("click");
  };

  // Show loading state while checking authentication or redirecting
  if (!gameReady || isRedirecting) {
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

  // Show unauthorized state if not authenticated via either method
  if (!isUserAuthenticated) {
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

  // Enhanced user info component with dual wallet support
  const UserInfoSection = () => {
    if (sidebarCollapsed) {
      return (
        <div className="flex flex-col items-center space-y-3 mb-6">
          {/* User Avatar/Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#cd7f32]/20 to-[#cd7f32]/10 rounded-full flex items-center justify-center ring-2 ring-[#cd7f32]/30">
            {walletIcon ? (
              <img src={walletIcon} alt={walletName} className="w-6 h-6" />
            ) : (
              <User className="w-5 h-5 text-[#cd7f32]" />
            )}
          </div>

          {/* Balance indicator */}
          <div className="flex flex-col items-center">
            {balanceLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#cd7f32]" />
            ) : isLowBalance ? (
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            ) : (
              <div className=""></div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 mb-4">
        {/* Wallet Details */}
        {walletConnected && userAddress && (
          <div className="space-y-2">
            {/* Wallet Type and Name */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {walletIcon ? (
                  <img src={walletIcon} alt={walletName} className="w-4 h-4" />
                ) : (
                  <Wallet className="w-4 h-4 text-[#cd7f32]" />
                )}
                {walletType === "external" && (
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 truncate">
                    {walletName}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      walletType === "embedded"
                        ? "bg-green-900/30 text-green-400 border border-green-500/30"
                        : "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {walletType === "embedded" ? "Embedded" : "External"}
                  </span>
                </div>
              </div>
            </div>

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

            {/* Available Wallets Info */}
            {availableWallets.length > 1 && (
              <div className="text-xs text-gray-500 pt-1 border-t border-gray-700">
                {availableWallets.length} wallet(s) available
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Calculate sidebar width based on state
  const getSidebarWidth = () => {
    if (isMobile) return sidebarOpen ? "w-72" : "w-0";
    return sidebarCollapsed ? "w-24" : "w-72";
  };

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] flex">
        {/* Notification Toast */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div
              className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm ${
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
            ${getSidebarWidth()} h-[100%] bg-[#1a1a1a] border-r border-[#cd7f32]/30 flex flex-col z-40 transition-all duration-300 ease-in-out overflow-hidden
          `}
        >
          {/* Sidebar Header */}
          <div
            className={`border-b border-[#cd7f32]/30 ${
              sidebarCollapsed && !isMobile ? "p-3" : "p-4 sm:p-6"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                {!sidebarCollapsed || isMobile ? (
                  <h1 className="text-[16px] font-bold text-[#cd7f32]">
                    Command Center
                  </h1>
                ) : (
                  <div className="flex items-center justify-center w-full"></div>
                )}

                {/* Control Buttons - only show when expanded or on mobile */}
                {(!sidebarCollapsed || isMobile) && (
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
                      onClick={handleDisconnectAll}
                      disabled={isRedirecting}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Disconnect All"
                    >
                      {isRedirecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Close Button / Desktop Collapse Button */}
              {isMobile ? (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={toggleSidebarCollapse}
                  className="p-2 items-center justify-center flex text-gray-400 hover:text-[#cd7f32] transition-colors rounded-lg hover:bg-[#cd7f32]/10 group"
                  title={
                    sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
                  }
                >
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  ) : (
                    <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
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
                  onClick={() => handleNavigation(item.id, item.path)}
                  onMouseEnter={() => playSound("hover")}
                  disabled={item.comingSoon}
                  className={`w-full flex items-center gap-3 transition-all duration-200 relative group ${
                    sidebarCollapsed && !isMobile
                      ? "justify-center p-3 rounded-xl"
                      : "px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl"
                  } ${
                    activeSection === item.id
                      ? sidebarCollapsed && !isMobile
                        ? "bg-[#cd7f32]/20 text-[#cd7f32]"
                        : "bg-[#cd7f32]/20 text-[#cd7f32] border border-[#cd7f32]/50 shadow-lg"
                      : item.comingSoon
                      ? "text-gray-500 cursor-not-allowed opacity-50"
                      : sidebarCollapsed && !isMobile
                      ? "text-gray-300 hover:bg-[#cd7f32]/10 hover:text-[#cd7f32]"
                      : "text-gray-300 hover:bg-[#cd7f32]/10 hover:text-[#cd7f32] hover:border hover:border-[#cd7f32]/30"
                  }`}
                >
                  {sidebarCollapsed && !isMobile ? (
                    // Collapsed state - just the icon
                    <div className="flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                  ) : (
                    // Expanded state - full layout
                    <>
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
                    </>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer Stats */}
          {(!sidebarCollapsed || isMobile) && (
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
          )}

          {/* Collapsed Footer Stats */}
          {sidebarCollapsed && !isMobile && (
            <div className="p-3 border-t border-[#cd7f32]/30 bg-[#0f0f0f]">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex flex-col items-center space-y-1">
                  <Sword className="w-4 h-4 text-[#cd7f32]" />
                  <span className="text-xs text-[#cd7f32] font-bold">
                    {userWarriors.length}
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="w-4 h-4 text-[#cd7f32]" />
                  <span className="text-xs text-[#cd7f32] font-bold">
                    {userProfile?.totalBattlesFought || 0}
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Trophy className="w-4 h-4 text-[#cd7f32]" />
                  <span className="text-xs text-[#cd7f32] font-bold">
                    {userProfile?.totalBattlesWon || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto scrollbar-invisible">
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
                  <h2 className="text-lg md:text-xl font-bold text-[#cd7f32] mb-1 sm:mb-2">
                    {getSectionTitle()}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                    {getSectionDescription()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                {/* Connection Status */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isUserAuthenticated ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-gray-400">
                    {isUserAuthenticated ? "Connected" : "Disconnected"}
                  </span>
                  {walletType && (
                    <span className="text-xs text-gray-500">
                      ({walletType})
                    </span>
                  )}
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
