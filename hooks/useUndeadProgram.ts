import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useSolanaWallets,
  useSignTransaction,
} from "@privy-io/react-auth/solana";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { PROGRAM_ID, PROGRAM_IDL } from "../config/program";
import { UndeadTypes } from "@/types/idlTypes";

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

const RPC_ENDPOINT = getRpcEndpoint();

// Create properly typed program type
type UndeadProgram = Program<UndeadTypes>;

interface WalletInfo {
  publicKey: PublicKey | null;
  isEmbedded: boolean;
  isConnected: boolean;
  walletType: "privy" | "external" | null;
}

export const useWalletInfo = (): WalletInfo => {
  const { ready: privyReady, authenticated, user } = usePrivy();
  const { wallets: solanaWallets, ready: walletsReady } = useSolanaWallets();

  return useMemo(() => {
    // Wait for both Privy and wallets to be ready
    if (!privyReady || !walletsReady) {
      return {
        publicKey: null,
        isEmbedded: false,
        isConnected: false,
        walletType: null,
      };
    }
    if (authenticated && user?.wallet?.address) {
      try {
        return {
          publicKey: new PublicKey(user.wallet.address),
          isEmbedded: true,
          isConnected: true,
          walletType: "privy",
        };
      } catch (error) {
        console.error("Error parsing Privy wallet address:", error);
      }
    }

    if (solanaWallets && solanaWallets.length > 0) {
      const primaryWallet = solanaWallets[0];
      return {
        publicKey: new PublicKey(primaryWallet.address),
        isEmbedded: false,
        isConnected: true,
        walletType: "external",
      };
    }

    // No wallet available
    return {
      publicKey: null,
      isEmbedded: false,
      isConnected: false,
      walletType: null,
    };
  }, [privyReady, walletsReady, authenticated, user?.wallet, solanaWallets]);
};

export const useUndeadProgram = (): UndeadProgram | null => {
  const { ready: privyReady, authenticated, user } = usePrivy();
  const { wallets: solanaWallets, ready: walletsReady } = useSolanaWallets();
  const { signTransaction } = useSignTransaction();
  const { publicKey, isConnected, walletType } = useWalletInfo();

  // Memoize connection
  const connection = useMemo(() => {
    return new Connection(RPC_ENDPOINT, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
      disableRetryOnRateLimit: false,
    });
  }, []);

  const program = useMemo(() => {
    if (!privyReady || !walletsReady || !isConnected || !publicKey) {
      return null;
    }

    try {
      // Create wallet adapter based on wallet type
      const walletAdapter = {
        publicKey,
        signTransaction: async (tx: Transaction | VersionedTransaction) => {
          try {
            console.log(
              `Signing with ${walletType} wallet:`,
              publicKey.toString()
            );

            if (
              walletType === "external" &&
              solanaWallets &&
              solanaWallets.length > 0
            ) {
              // For external wallets, we need to request signature
              console.log("Using external wallet direct interface");
              const externalWallet = solanaWallets[0];

              if (typeof externalWallet.signTransaction === "function") {
                try {
                  // Try this.
                  const signedTx = await externalWallet.signTransaction(tx);
                  return signedTx;
                } catch (modernError) {
                  console.warn("SignTransaction failed", modernError);
                  throw modernError;
                }
              } else {
                throw new Error(
                  "External wallet does not support transaction signing"
                );
              }
            } else if (walletType === "privy") {
              // For Privy embedded wallets only
              console.log("Using Privy embedded wallet");

              const signedTx = await signTransaction({
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
            } else {
              throw new Error(`Unsupported wallet type: ${walletType}`);
            }
          } catch (error) {
            console.error(
              `Error signing transaction with ${walletType} wallet:`,
              error
            );
            throw error;
          }
        },
        signAllTransactions: async (
          txs: (Transaction | VersionedTransaction)[]
        ) => {
          try {
            console.log(
              `Signing multiple transactions with ${walletType} wallet`
            );

            if (
              walletType === "external" &&
              solanaWallets &&
              solanaWallets.length > 0
            ) {
              // For external wallets, try batch signing first
              const externalWallet = solanaWallets[0];

              if (typeof externalWallet.signAllTransactions === "function") {
                try {
                  return await externalWallet.signAllTransactions(txs);
                } catch (batchError) {
                  console.warn(
                    "Batch signing failed, falling back to individual signing:",
                    batchError
                  );
                }
              }

              // Fallback: sign one by one
              const signedTxs = [];
              for (const tx of txs) {
                if (typeof externalWallet.signTransaction === "function") {
                  const signedTx = await externalWallet.signTransaction(tx);
                  signedTxs.push(signedTx);
                } else {
                  throw new Error(
                    "External wallet does not support transaction signing"
                  );
                }
              }
              return signedTxs;
            } else if (walletType === "privy") {
              const signedTxs = [];
              for (const tx of txs) {
                const signedTx = await signTransaction({
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
              throw new Error(`Unsupported wallet type: ${walletType}`);
            }
          } catch (error) {
            console.error(
              `Error signing multiple transactions with ${walletType} wallet:`,
              error
            );
            throw error;
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

      console.log(
        `Program initialized with ${walletType} wallet:`,
        publicKey.toString()
      );
      return programInstance;
    } catch (error) {
      console.error("Error creating program instance:", error);
      return null;
    }
  }, [
    privyReady,
    walletsReady,
    authenticated,
    publicKey,
    walletType,
    isConnected,
    connection,
    signTransaction,
    solanaWallets,
  ]);

  return program;
};

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
        [Buffer.from("config")],
        PROGRAM_ID
      );

      const [profilePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), userPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const [achievementsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("achievements"), userPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const getWarriorPda = (name: string) => {
        if (!name || name.trim().length === 0) {
          throw new Error("Warrior name cannot be empty");
        }

        const [warriorPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("warrior"),
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

// //disconnect wallet
// export const useWalletDisconnect = () => {
//   const { wallets: solanaWallets } = useSolanaWallets();
//   const { walletType } = useWalletInfo();

//   const disconnectWallet = async () => {
//     try {
//       console.log(`Disconnecting ${walletType} wallet`);

//       if (
//         walletType === "external" &&
//         solanaWallets &&
//         solanaWallets.length > 0
//       ) {
//         // Disconnect external wallets
//         const promises = solanaWallets.map(async (wallet) => {
//           try {
//             if (typeof wallet.disconnect === "function") {
//               wallet.disconnect();
//               console.log(`Disconnected ${wallet.walletClientType}`);
//             }
//           } catch (error) {
//             console.warn(
//               `Failed to disconnect ${wallet.walletClientType}:`,
//               error
//             );
//           }
//         });

//         await Promise.allSettled(promises);
//       }

//       return { success: true };
//     } catch (error) {
//       console.error("Error during wallet disconnect:", error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Failed to disconnect",
//       };
//     }
//   };

//   return { disconnectWallet };
// };

// Helper hook to get current wallet information
export const useCurrentWallet = () => {
  const { publicKey, isConnected, walletType } = useWalletInfo();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { user } = usePrivy();

  return useMemo(() => {
    if (!isConnected || !publicKey) {
      return {
        address: null,
        type: null,
        name: null,
        isConnected: false,
      };
    }

    if (
      walletType === "external" &&
      solanaWallets &&
      solanaWallets.length > 0
    ) {
      const externalWallet = solanaWallets[0];
      return {
        address: publicKey.toString(),
        type: "external",
        name: externalWallet.walletClientType || "External Wallet",
        isConnected: true,
      };
    }

    if (walletType === "privy" && user?.wallet) {
      return {
        address: publicKey.toString(),
        type: "embedded",
        name: "Privy Wallet",
        isConnected: true,
      };
    }

    return {
      address: null,
      type: null,
      name: null,
      isConnected: false,
    };
  }, [publicKey, isConnected, walletType, solanaWallets, user?.wallet]);
};
