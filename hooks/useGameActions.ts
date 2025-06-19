import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { UndeadTypes } from "@/types/idlTypes";

type UndeadProgram = Program<UndeadTypes>;

export interface CreateWarriorParams {
  program: UndeadProgram;
  userPublicKey: PublicKey;
  name: string;
  dna: string;
  warriorPda: PublicKey;
  profilePda: PublicKey;
  configPda: PublicKey;
}

export interface BattleWarriorsParams {
  program: Program;
  userPublicKey: PublicKey;
  warriorAPda: PublicKey;
  warriorBPda: PublicKey;
  profileAPda: PublicKey;
  profileBPda: PublicKey;
  configPda: PublicKey;
}

export interface ActionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export const createWarrior = async ({
  program,
  userPublicKey,
  name,
  dna,
  warriorPda,
  profilePda,
  configPda,
}: CreateWarriorParams): Promise<ActionResult> => {
  // Input validation
  if (!program) {
    return { success: false, error: "Program not initialized" };
  }

  if (!userPublicKey) {
    return { success: false, error: "User public key required" };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Warrior name is required" };
  }

  if (name.trim().length > 32) {
    return {
      success: false,
      error: "Warrior name must be 32 characters or less",
    };
  }

  if (!dna || dna.length === 0) {
    return { success: false, error: "Warrior DNA is required" };
  }

  try {
    // Check if warrior already exists
    try {
      await program.account.undeadWarrior.fetch(warriorPda);
      return {
        success: false,
        error: "A warrior with this name already exists",
      };
    } catch (fetchError) {
      // Warrior doesn't exist, which is what we want
    }

    const tx = await program.methods
      .createWarrior(name.trim(), dna)
      .accountsPartial({
        user: userPublicKey,
        warrior: warriorPda,
        userProfile: profilePda,
        config: configPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc({
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

    return { success: true, signature: tx };
  } catch (error: any) {
    console.error("Error creating warrior:", error);

    // Parse common Solana errors
    let errorMessage = "Unknown error occurred";

    if (error?.message) {
      if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient SOL balance for transaction";
      } else if (error.message.includes("blockhash not found")) {
        errorMessage = "Network congestion - please try again";
      } else if (error.message.includes("already in use")) {
        errorMessage = "Warrior name already taken";
      } else if (error.message.includes("User rejected")) {
        errorMessage = "Transaction cancelled by user";
      } else {
        errorMessage = error.message;
      }
    }

    return { success: false, error: errorMessage };
  }
};

export const battleWarriors = async ({
  program,
  userPublicKey,
  warriorAPda,
  warriorBPda,
  profileAPda,
  profileBPda,
  configPda,
}: BattleWarriorsParams): Promise<ActionResult> => {
  if (!program || !userPublicKey) {
    return { success: false, error: "Program or user not initialized" };
  }

  try {
    const tx = await program.methods
      .battleWarriors()
      .accountsPartial({
        user: userPublicKey,
        warriorA: warriorAPda,
        warriorB: warriorBPda,
        profileA: profileAPda,
        profileB: profileBPda,
        config: configPda,
      })
      .rpc({
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

    return { success: true, signature: tx };
  } catch (error: any) {
    console.error("Error in battle:", error);
    return {
      success: false,
      error: error?.message || "Battle failed",
    };
  }
};

export const updateAchievements = async (
  program: Program,
  userPublicKey: PublicKey,
  achievementsPda: PublicKey,
  profilePda: PublicKey
): Promise<ActionResult> => {
  if (!program || !userPublicKey) {
    return { success: false, error: "Program or user not initialized" };
  }

  try {
    const tx = await program.methods
      .updateAchievements()
      .accountsPartial({
        user: userPublicKey,
        achievements: achievementsPda,
        userProfile: profilePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc({
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

    return { success: true, signature: tx };
  } catch (error: any) {
    console.error("Error updating achievements:", error);
    return {
      success: false,
      error: error?.message || "Failed to update achievements",
    };
  }
};

export const generateRandomDNA = (): string => {
  const chars = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Utility function to check transaction status
export const checkTransactionStatus = async (
  connection: any,
  signature: string
): Promise<{ confirmed: boolean; error?: string }> => {
  try {
    const result = await connection.confirmTransaction(signature, "confirmed");
    return {
      confirmed: !result.value.err,
      error: result.value.err?.toString(),
    };
  } catch (error: any) {
    return { confirmed: false, error: error.message };
  }
};
