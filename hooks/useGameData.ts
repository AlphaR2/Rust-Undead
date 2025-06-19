import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { usePrivy } from "@privy-io/react-auth";
import { useUndeadProgram, usePDAs, useWalletInfo } from "./useUndeadProgram";
import {
  AnchorUndeadWarrior,
  AnchorUserProfile,
  AnchorGameConfig,
  ProgramAccount,
  Warrior,
  UserProfile,
  GameConfig,
} from "../types/undead";

// Program account types
type UndeadWarriorProgramAccount = ProgramAccount<AnchorUndeadWarrior>;

// Network info type
type NetworkInfo = {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const getRpcEndpoint = (): string => {
  const envRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  if (envRpc && envRpc.trim()) {
    // Basic URL validation
    try {
      new URL(envRpc);
      return envRpc;
    } catch (error) {
      console.warn(
        "Invalid RPC URL in environment variable, falling back to default:",
        error
      );
    }
  }

  return "https://api.devnet.solana.com";
};

// Network detection function
const getNetworkInfo = (rpcUrl: string): NetworkInfo => {
  const url = rpcUrl.toLowerCase();

  if (url.includes("mainnet") || url.includes("api.mainnet-beta.solana.com")) {
    return {
      name: "Mainnet",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-500/30",
    };
  }

  if (url.includes("devnet") || url.includes("api.devnet.solana.com")) {
    return {
      name: "Devnet",
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-500/30",
    };
  }

  if (url.includes("testnet") || url.includes("api.testnet.solana.com")) {
    return {
      name: "Testnet",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-500/30",
    };
  }

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return {
      name: "Localhost",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30",
    };
  }

  return {
    name: "Custom",
    color: "text-gray-400",
    bgColor: "bg-gray-900/20",
    borderColor: "border-gray-500/30",
  };
};

const RPC_ENDPOINT = getRpcEndpoint();

export const useGameData = () => {
  const { ready, authenticated, user } = usePrivy();

  // Use the new dual wallet system
  const { publicKey, isConnected } = useWalletInfo();

  // Memoize connection
  const connection = useMemo(() => {
    return new Connection(RPC_ENDPOINT, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
      disableRetryOnRateLimit: false,
    });
  }, []);

  // Memoize network info
  const networkInfo = useMemo(() => {
    return getNetworkInfo(RPC_ENDPOINT);
  }, []);

  const program = useUndeadProgram();
  const { configPda, profilePda, achievementsPda } = usePDAs(publicKey);

  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userWarriors, setUserWarriors] = useState<Warrior[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInitiallyLoaded = useRef(false);
  const isCurrentlyLoading = useRef(false);

  const fetchBalance = useCallback(async () => {
    if (!connection || !publicKey || balanceLoading) return;

    setBalanceLoading(true);
    setBalanceError(null);

    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceError("Failed to load balance");
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, [connection, publicKey, balanceLoading]);

  const fetchGameConfig = useCallback(async () => {
    if (!program || !configPda) return;

    try {
      const config: AnchorGameConfig = await program.account.gameConfig.fetch(
        configPda
      );
      setGameConfig({
        admin: config.admin,
        totalWarriorsCreated: config.totalWarriorsCreated,
        totalBattlesFought: config.totalBattlesFought,
        initializedAt: config.initializedAt.toNumber(),
        isPaused: config.isPaused,
      });
    } catch (error: any) {
      console.log("Game config not found (program not initialized)");
      setGameConfig(null);
    }
  }, [program, configPda]);

  const fetchUserProfile = useCallback(async () => {
    if (!program || !profilePda || !publicKey) return;

    try {
      const profile: AnchorUserProfile =
        await program.account.userProfile.fetch(profilePda);
      setUserProfile({
        owner: profile.owner,
        warriorsCreated: profile.warriorsCreated,
        totalBattlesWon: profile.totalBattlesWon,
        totalBattlesFought: profile.totalBattlesFought,
        joinDate: profile.joinDate.toNumber(),
      });
    } catch (error: any) {
      console.log("User profile not found (not created yet)");
      setUserProfile(null);
    }
  }, [program, profilePda, publicKey]);

  const fetchUserWarriors = useCallback(async () => {
    if (!program || !publicKey) {
      setUserWarriors([]);
      return;
    }

    try {
      // Get all program accounts that are warriors
      const allWarriorAccounts: UndeadWarriorProgramAccount[] =
        await program.account.undeadWarrior.all();

      // Filter by owner
      const userWarriorAccounts = allWarriorAccounts.filter(
        (account: UndeadWarriorProgramAccount) =>
          account.account.owner.equals(publicKey)
      );

      // Transform raw Anchor types to clean frontend types
      const warriors: Warrior[] = userWarriorAccounts.map(
        (account: UndeadWarriorProgramAccount) => ({
          name: account.account.name,
          dna: account.account.dna,
          owner: account.account.owner,
          powerLevel: account.account.powerLevel,
          createdAt: account.account.createdAt.toNumber(),
          battleWins: account.account.battleWins,
          battlesFought: account.account.battlesFought,
          experiencePoints: account.account.experiencePoints.toNumber(),
          address: account.publicKey,
        })
      );

      setUserWarriors(warriors);
    } catch (error: any) {
      console.error("Error fetching user warriors:", error);
      setError("Failed to fetch warriors");
      setUserWarriors([]);
    }
  }, [program, publicKey]);

  // Memoize the load function to prevent dependency changes
  const loadAllData = useCallback(async () => {
    if (!program || !publicKey || !isConnected || isCurrentlyLoading.current) {
      return;
    }

    isCurrentlyLoading.current = true;
    setLoading(true);
    setError(null);

    try {
      await fetchBalance();
      await new Promise((resolve) => setTimeout(resolve, 100));

      await fetchGameConfig();
      await new Promise((resolve) => setTimeout(resolve, 100));

      await fetchUserProfile();
      await new Promise((resolve) => setTimeout(resolve, 100));

      await fetchUserWarriors();

      hasInitiallyLoaded.current = true;
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
      isCurrentlyLoading.current = false;
    }
  }, [
    program,
    publicKey,
    isConnected,
    fetchGameConfig,
    fetchBalance,
    fetchUserProfile,
    fetchUserWarriors,
  ]);

  const refreshData = useCallback(async () => {
    if (!program || !publicKey || !isConnected) return;

    hasInitiallyLoaded.current = false;
    await loadAllData();
  }, [program, publicKey, isConnected, loadAllData]);

  // Memoize the stable values to prevent unnecessary re-renders
  const stableValues = useMemo(
    () => ({
      ready,
      isConnected,
      publicKeyString: publicKey?.toString() || null,
      hasProgram: !!program,
    }),
    [ready, isConnected, publicKey, program]
  );

  // Main effect with stable dependencies
  useEffect(() => {
    if (
      stableValues.ready &&
      stableValues.isConnected &&
      stableValues.hasProgram &&
      stableValues.publicKeyString &&
      !hasInitiallyLoaded.current &&
      !isCurrentlyLoading.current
    ) {
      // Small delay to ensure everything is ready
      const timeoutId = setTimeout(() => {
        loadAllData();
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [stableValues, loadAllData]);

  useEffect(() => {
    if (!isConnected) {
      setGameConfig(null);
      setUserProfile(null);
      setUserWarriors([]);
      setBalance(null);
      setError(null);
      setBalanceError(null);
      hasInitiallyLoaded.current = false;
      isCurrentlyLoading.current = false;
    }
  }, [isConnected]);

  // Handle public key changes - separate effect
  const previousPublicKey = useRef<string | null>(null);
  useEffect(() => {
    const currentKey = publicKey?.toString() || null;
    if (previousPublicKey.current !== currentKey) {
      hasInitiallyLoaded.current = false;
      isCurrentlyLoading.current = false;
      previousPublicKey.current = currentKey;

      // Clear old data when switching wallets
      if (currentKey !== previousPublicKey.current) {
        setGameConfig(null);
        setUserProfile(null);
        setUserWarriors([]);
        setBalance(null);
        setError(null);
        setBalanceError(null);
      }
    }
  }, [publicKey]);

  const hasWarriors = userWarriors.length > 0;
  const userAddress = publicKey?.toString() || null;

  return {
    ready,
    authenticated,
    isConnected,
    user,
    userAddress,
    publicKey,
    connection,
    networkInfo,
    gameConfig,
    userProfile,
    balance,
    balanceError,
    balanceLoading,
    userWarriors,
    hasWarriors,
    loading,
    fetchBalance,
    error,
    refreshData,
    pdas: { configPda, profilePda, achievementsPda },
  };
};
