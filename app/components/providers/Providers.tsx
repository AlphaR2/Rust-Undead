"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { SolanaProvider } from "./SolanaProvider";
import { ReactNode } from "react";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_ID || "";

if (!privyAppId) {
  throw new Error("NEXT_PUBLIC_PRIVY_ID environment variable is required");
}

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SolanaProvider>
      <PrivyProvider
        appId={privyAppId}
        config={{
          solanaClusters: [
            { name: "devnet", rpcUrl: "https://api.devnet.solana.com" },
          ],
          embeddedWallets: {
            solana: {
              createOnLogin: "all-users",
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </SolanaProvider>
  );
}
