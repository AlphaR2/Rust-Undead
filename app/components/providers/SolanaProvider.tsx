"use client";

import { WalletError } from "@solana/wallet-adapter-base";
import {
  AnchorWallet,
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { AnchorProvider } from "@coral-xyz/anchor";

function useCluster() {
  return useMemo(() => {
    const endpoint =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
    return {
      endpoint,
      name: endpoint.includes("devnet")
        ? "devnet"
        : endpoint.includes("testnet")
        ? "testnet"
        : "mainnet",
    };
  }, []);
}

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export const WalletDisconnectButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { endpoint } = useCluster();

  // Configure all the wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet Error:", error);

    if (error.message?.includes("User rejected")) {
      console.log("User rejected the connection");
    } else if (error.message?.includes("Wallet not found")) {
      console.log("Wallet extension not found");
    }
  }, []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      }}
    >
      <WalletProvider wallets={wallets} onError={onError} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    return new AnchorProvider(connection, wallet as AnchorWallet, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
      skipPreflight: false,
    });
  }, [connection, wallet]);
}

export function useSolanaConnection() {
  return useConnection();
}

export function useSolanaWallet() {
  return useWallet();
}

// Hook to get wallet connection info
export function useWalletConnectionInfo() {
  const { connected, connecting, disconnecting, wallet, publicKey } =
    useWallet();

  return useMemo(
    () => ({
      isConnected: connected,
      isConnecting: connecting,
      isDisconnecting: disconnecting,
      walletName: wallet?.adapter.name || null,
      walletIcon: wallet?.adapter.icon || null,
      publicKey: publicKey?.toString() || null,
      shortAddress: publicKey
        ? `${publicKey.toString().slice(0, 4)}...${publicKey
            .toString()
            .slice(-4)}`
        : null,
    }),
    [connected, connecting, disconnecting, wallet, publicKey]
  );
}
