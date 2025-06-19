"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_ID || "";

if (!privyAppId) {
  console.error("ENVs of privy app id needed");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: { walletChainType: "solana-only" },
        externalWallets: {
          solana: { connectors: toSolanaWalletConnectors() },
        },
        // Create embedded wallets for users who don't have a wallet
        solanaClusters: [
          { name: "devnet", rpcUrl: "https://api.devnet.solana.com" },
        ],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
