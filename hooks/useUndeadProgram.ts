import { useMemo, useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSignTransaction } from "@privy-io/react-auth/solana";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, PROGRAM_IDL, authority } from "../config/program";
import { RustUndead as UndeadTypes } from "@/types/idlTypes";

// const getRpcEndpoint = (): string => {
//   const envRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

//   if (envRpc && envRpc.trim()) {
//     try {
//       new URL(envRpc);
//       return envRpc;
//     } catch (error) {
//       console.warn(
//         "Invalid RPC URL in environment variable, falling back to default:",
//         error
//       );
//     }
//   }

//   return "https://api.devnet.solana.com";
// };

// const RPC_ENDPOINT = getRpcEndpoint();
type UndeadProgram = Program<UndeadTypes>;

interface WalletOption {
  publicKey: PublicKey;
  isEmbedded: boolean;
  walletType: "privy_embedded" | "solana_adapter";
  name: string;
  icon?: string;
  walletClientType?: string;
}

interface WalletInfo extends WalletOption {
  isConnected: boolean;
  availableWallets: WalletOption[];
  switchWallet: (walletType: "privy_embedded" | "solana_adapter") => void;
  hasPrivyWallet: boolean;
  hasSolanaWallet: boolean;
}

export const useWalletInfo = (): WalletInfo => {
  // Privy hooks for authentication and embedded wallets
  const { ready: privyReady, authenticated, user } = usePrivy();

  // Standard Solana wallet adapter hooks
  const {
    publicKey: adapterPublicKey,
    connected: adapterConnected,
    wallet: adapterWallet,
  } = useWallet();

  // State to track which wallet user wants to use
  const [selectedWalletType, setSelectedWalletType] = useState<
    "privy_embedded" | "solana_adapter" | null
  >(null);

  const availableWallets = useMemo(() => {
    const wallets: WalletOption[] = [];

    // Add Solana adapter wallet
    if (adapterConnected && adapterPublicKey && adapterWallet) {
      wallets.push({
        publicKey: adapterPublicKey,
        isEmbedded: false,
        walletType: "solana_adapter",
        name: adapterWallet.adapter.name || "External Wallet",
        icon: adapterWallet.adapter.icon,
        walletClientType: adapterWallet.adapter.name,
      });
    }

    //check for Solana embedded wallet
    if (authenticated && user?.linkedAccounts) {
      const embeddedSolanaWallet = user.linkedAccounts.find(
        (account) =>
          account.type === "wallet" &&
          account.walletClientType === "privy" &&
          account.chainType === "solana"
      );

      if (embeddedSolanaWallet && user?.wallet?.address) {
        try {
          wallets.push({
            publicKey: new PublicKey(user?.wallet.address),
            isEmbedded: true,
            walletType: "privy_embedded",
            name: "Privy Embedded Wallet",
          });
        } catch (error) {
          console.error("Error parsing Privy Solana wallet address:", error);
        }
      } else if (user?.wallet?.address && !embeddedSolanaWallet) {
        try {
          const publicKey = new PublicKey(user.wallet.address);
          wallets.push({
            publicKey,
            isEmbedded: true,
            walletType: "privy_embedded",
            name: "Privy Embedded Wallet",
          });
        } catch (error) {
          console.log("User wallet is not a valid Solana address:", error);
        }
      }
    }

    return wallets;
  }, [
    privyReady,
    authenticated,
    user?.linkedAccounts,
    user?.wallet,
    adapterConnected,
    adapterPublicKey,
    adapterWallet,
  ]);

  const switchWallet = useCallback(
    (walletType: "privy_embedded" | "solana_adapter") => {
      setSelectedWalletType(walletType);
    },
    []
  );

  // Helper booleans
  const hasPrivyWallet = useMemo(() => {
    return availableWallets.some((w) => w.walletType === "privy_embedded");
  }, [availableWallets]);

  const hasSolanaWallet = useMemo(() => {
    return availableWallets.some((w) => w.walletType === "solana_adapter");
  }, [availableWallets]);

  return useMemo(() => {
    // Wait for Privy to be ready
    if (!privyReady) {
      return {
        publicKey: null as any,
        isEmbedded: false,
        isConnected: false,
        walletType: null as any,
        name: "",
        availableWallets: [],
        switchWallet,
        hasPrivyWallet: false,
        hasSolanaWallet: false,
      };
    }

    if (availableWallets.length === 0) {
      return {
        publicKey: null as any,
        isEmbedded: false,
        isConnected: false,
        walletType: null as any,
        name: "",
        availableWallets: [],
        switchWallet,
        hasPrivyWallet,
        hasSolanaWallet,
      };
    }

    // Determine which wallet to use
    let selectedWallet: WalletOption;

    if (selectedWalletType === null) {
      // Auto-select: prefer Solana adapter if available, otherwise Privy
      const solanaWallet = availableWallets.find(
        (w) => w.walletType === "solana_adapter"
      );
      selectedWallet = solanaWallet || availableWallets[0];
    } else {
      // Find the requested wallet type
      const requestedWallet = availableWallets.find(
        (w) => w.walletType === selectedWalletType
      );
      selectedWallet = requestedWallet || availableWallets[0];
    }

    return {
      ...selectedWallet,
      isConnected: true,
      availableWallets,
      switchWallet,
      hasPrivyWallet,
      hasSolanaWallet,
    };
  }, [
    privyReady,
    availableWallets,
    selectedWalletType,
    switchWallet,
    hasPrivyWallet,
    hasSolanaWallet,
  ]);
};

export const useUndeadProgram = (): UndeadProgram | null => {
  // Privy hooks
  const { ready: privyReady, authenticated, user } = usePrivy();
  const privySignTransaction = useSignTransaction();

  // Standard wallet adapter hooks
  const {
    publicKey: adapterPublicKey,
    connected: adapterConnected,
    signTransaction: adapterSignTransaction,
    signAllTransactions: adapterSignAllTransactions,
  } = useWallet();

  // Use the wallet adapter connection instead of creating our own
  const { connection } = useConnection();

  // Our wallet info
  const { publicKey, isConnected, walletType, availableWallets } =
    useWalletInfo();

  const program = useMemo(() => {
    if (!privyReady || !isConnected || !publicKey) {
      return null;
    }

    try {
      // Create wallet adapter based on wallet type
      const walletAdapter = {
        publicKey,
        signTransaction: async (tx: Transaction | VersionedTransaction) => {
          if (walletType === "solana_adapter") {
            // Use standard Solana wallet adapter
            if (!adapterConnected || !adapterSignTransaction) {
              throw new Error(
                "Solana wallet not connected or doesn't support signing"
              );
            }

            if (
              !adapterPublicKey ||
              adapterPublicKey.toString() !== publicKey.toString()
            ) {
              throw new Error("Solana wallet public key mismatch");
            }

            const signedTx = await adapterSignTransaction(tx);

            return signedTx;
          } else if (walletType === "privy_embedded") {
            // Use Privy embedded wallet
            if (!authenticated || !user) {
              throw new Error("User not authenticated with Privy");
            }

            // Verify this is actually a Privy embedded wallet
            const isPrivyWallet = availableWallets.some(
              (w) =>
                w.walletType === "privy_embedded" &&
                w.publicKey.toString() === publicKey.toString()
            );

            if (!isPrivyWallet) {
              throw new Error("Current wallet is not a Privy embedded wallet");
            }

            try {
              const signedTx = await privySignTransaction.signTransaction({
                transaction: tx,
                connection,
                uiOptions: {
                  showWalletUIs: true,
                },
                transactionOptions: {
                  skipPreflight: false,
                  preflightCommitment: "confirmed",
                },
              });

              return signedTx;
            } catch (privyError: any) {
              console.error("❌ Privy signing error:", privyError);
              throw new Error(`Privy signing failed: ${privyError.message}`);
            }
          } else {
            throw new Error(`❌ Unknown wallet type: ${walletType}`);
          }
        },

        signAllTransactions: async (
          txs: (Transaction | VersionedTransaction)[]
        ) => {
          if (walletType === "solana_adapter") {
            // Use standard wallet adapter batch signing
            if (!adapterConnected) {
              throw new Error("Solana wallet not connected");
            }

            if (adapterSignAllTransactions) {
              return await adapterSignAllTransactions(txs);
            } else if (adapterSignTransaction) {
              // Fallback to individual signing

              const signedTxs = [];
              for (const tx of txs) {
                const signedTx = await adapterSignTransaction(tx);
                signedTxs.push(signedTx);
              }
              return signedTxs;
            } else {
              throw new Error("Solana wallet doesn't support signing");
            }
          } else if (walletType === "privy_embedded") {
            // Privy doesn't support batch signing, so sign individually
            const signedTxs = [];
            for (const tx of txs) {
              const signedTx = await privySignTransaction.signTransaction({
                transaction: tx,
                connection,
                uiOptions: {
                  showWalletUIs: true,
                },
                transactionOptions: {
                  skipPreflight: false,
                  preflightCommitment: "confirmed",
                },
              });
              signedTxs.push(signedTx);
            }
            return signedTxs;
          } else {
            throw new Error(
              `❌ Unknown wallet type for batch signing: ${walletType}`
            );
          }
        },
      };

      const provider = new AnchorProvider(connection, walletAdapter as any, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
        skipPreflight: false,
      });

      const idl = PROGRAM_IDL as UndeadTypes;
      const programInstance = new Program(idl, provider) as UndeadProgram;

      return programInstance;
    } catch (error) {
      console.error("❌ Error creating program instance:", error);
      return null;
    }
  }, [
    privyReady,
    authenticated,
    user,
    publicKey,
    walletType,
    isConnected,
    connection,
    privySignTransaction,
    adapterConnected,
    adapterPublicKey,
    adapterSignTransaction,
    adapterSignAllTransactions,
    availableWallets,
  ]);

  return program;
};

// Keep your existing PDAs hook unchanged
export const usePDAs = (userPublicKey?: PublicKey | null) => {
  return useMemo(() => {
    if (!userPublicKey) {
      return {
        configPda: null,
        profilePda: null,
        achievementsPda: null,
        getWarriorPda: null,
      };
    }

    try {
      const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("config"), authority.toBuffer()],
        PROGRAM_ID
      );

      const [profilePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_profile"), userPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const [achievementsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_achievements"), userPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const getWarriorPda = (name: string) => {
        if (!name || name.trim().length === 0) {
          throw new Error("Warrior name cannot be empty");
        }

        const [warriorPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("undead_warrior"),
            userPublicKey.toBuffer(),
            Buffer.from(name.trim()),
          ],
          PROGRAM_ID
        );
        return warriorPda;
      };

      return {
        configPda,
        profilePda,
        achievementsPda,
        getWarriorPda,
      };
    } catch (error) {
      console.error("Error generating PDAs:", error);
      return {
        configPda: null,
        profilePda: null,
        achievementsPda: null,
        getWarriorPda: null,
      };
    }
  }, [userPublicKey]);
};

// Updated helper hook with connection status
export const useCurrentWallet = () => {
  const walletInfo = useWalletInfo();

  return useMemo(() => {
    if (!walletInfo.isConnected || !walletInfo.publicKey) {
      return {
        address: null,
        type: null,
        name: null,
        icon: null,
        isConnected: false,
        availableWallets: walletInfo.availableWallets,
        switchWallet: walletInfo.switchWallet,
        hasPrivyWallet: walletInfo.hasPrivyWallet,
        hasSolanaWallet: walletInfo.hasSolanaWallet,
      };
    }

    return {
      address: walletInfo.publicKey.toString(),
      type: walletInfo.isEmbedded ? "embedded" : "external",
      name: walletInfo.name,
      icon: walletInfo.icon,
      isConnected: true,
      availableWallets: walletInfo.availableWallets,
      switchWallet: walletInfo.switchWallet,
      hasPrivyWallet: walletInfo.hasPrivyWallet,
      hasSolanaWallet: walletInfo.hasSolanaWallet,
    };
  }, [walletInfo]);
};
