import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { RustUndead as UndeadTypes } from "@/types/idlTypes";
import { ImageRarity, Warrior, WarriorClass } from "@/types/undead";
import { authority } from "@/config/program";

type UndeadProgram = Program<UndeadTypes>;

export interface CreateWarriorParams {
  program: UndeadProgram;
  userPublicKey: PublicKey;
  name: string;
  dna: string;
  warriorPda: PublicKey;
  configPda: PublicKey;
  profilePda: PublicKey;
  userAchievementsPda: PublicKey;
  warriorClass: WarriorClass;
  onProgress?: (stage: VRFStage, message: string) => void;
}

export interface VRFStage {
  stage:
    | "initializing"
    | "submitting"
    | "waiting_vrf"
    | "polling"
    | "completed"
    | "error";
  progress: number; // 0-100
}

export interface WarriorCreationResult {
  success: boolean;
  signature?: string;
  error?: string;
  warrior?: Warrior | null;
}

export const createWarriorWithVRF = async ({
  program,
  userPublicKey,
  name,
  dna,
  warriorPda,
  profilePda,
  configPda,
  userAchievementsPda,
  warriorClass,
  onProgress,
}: CreateWarriorParams): Promise<WarriorCreationResult> => {
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

  if (!dna || dna.length !== 8) {
    return {
      success: false,
      error: "Warrior DNA must be exactly 8 characters",
    };
  }

  const clientSeed = Math.floor(Math.random() * 256);

  try {
    // Stage 1: Initializing
    onProgress?.(
      { stage: "initializing", progress: 10 },
      "🔧 Preparing warrior forge..."
    );

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

    // Stage 2: Submitting transaction
    onProgress?.(
      { stage: "submitting", progress: 20 },
      "⚡ Submitting creation transaction..."
    );

    // Convert DNA string to byte array
    const dnaBytes = Array.from(dna).map((char) => char.charCodeAt(0));
    if (dnaBytes.length !== 8) {
      return { success: false, error: "Invalid DNA format" };
    }

    // Convert warrior class to the format expected by the program
    const classVariant = getWarriorClassVariant(warriorClass);

    const tx = await program.methods
      .createWarrior(name.trim(), dnaBytes, classVariant, clientSeed)
      .accountsPartial({
        player: userPublicKey,
        authority,
        warrior: warriorPda,
        userProfile: profilePda,
        userAchievements: userAchievementsPda,
        config: configPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc({
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

    // Stage 3: Transaction submitted, waiting for VRF
    onProgress?.(
      { stage: "waiting_vrf", progress: 40 },
      "🎲 Transaction confirmed! Waiting for ancient magic (VRF)..."
    );

    // Stage 4: VRF Polling with gamified messages
    onProgress?.(
      { stage: "polling", progress: 50 },
      "🔮 The cosmic forge is awakening..."
    );

    const vrfMessages = [
      "⚡ Lightning crackles through the ethereal realm...",
      "🌟 Star-forged essence flows into your warrior...",
      "🔥 Ancient runes are being inscribed...",
      "💎 Crystallizing combat prowess...",
      "🧠 Infusing tactical knowledge...",
      "⚔️ Sharpening battle instincts...",
      "🛡️ Hardening defensive capabilities...",
      "🎨 Manifesting visual form...",
    ];

    let retryCount = 0;
    const maxRetries = 20; // 20 attempts * 3 seconds = 1 minute
    let messageIndex = 0;

    while (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second intervals

      // Update progress with rotating messages
      const progress = 50 + (retryCount / maxRetries) * 40; // 50-90%
      const currentMessage = vrfMessages[messageIndex % vrfMessages.length];
      onProgress?.({ stage: "polling", progress }, currentMessage);
      messageIndex++;

      try {
        const warriorAccount = await program.account.undeadWarrior.fetch(
          warriorPda
        );

        console.log(`VRF Poll ${retryCount + 1}/${maxRetries}:`);
        console.log(`   ATK: ${warriorAccount.baseAttack}`);
        console.log(`   DEF: ${warriorAccount.baseDefense}`);
        console.log(`   KNOW: ${warriorAccount.baseKnowledge}`);
        console.log(`   Image URI: ${warriorAccount.imageUri || "Not set"}`);

        // Check if VRF completed (all stats > 0 and image URI exists)
        if (
          warriorAccount.baseAttack > 0 &&
          warriorAccount.baseDefense > 0 &&
          warriorAccount.baseKnowledge > 0 &&
          warriorAccount.imageUri &&
          warriorAccount.imageUri.length > 0
        ) {
          onProgress?.(
            { stage: "completed", progress: 100 },
            "🎉 Warrior forged successfully! Stats and appearance manifested!"
          );

          return {
            success: true,
            signature: tx,
            warrior: {
              name: warriorAccount.name,
              address: warriorAccount.address,
              owner: warriorAccount.owner,
              dna: warriorAccount.dna,
              createdAt: warriorAccount.createdAt,
              currentHp: warriorAccount.currentHp,
              baseAttack: warriorAccount.baseAttack,
              baseDefense: warriorAccount.baseDefense,
              baseKnowledge: warriorAccount.baseKnowledge,
              maxHp: warriorAccount.maxHp,
              battlesWon: warriorAccount.battlesWon,
              battlesLost: warriorAccount.battlesLost,
              experiencePoints: warriorAccount.experiencePoints,
              level: warriorAccount.level,
              lastBattleAt: warriorAccount.lastBattleAt,
              cooldownExpiresAt: warriorAccount.cooldownExpiresAt,
              imageIndex: warriorAccount.imageIndex,
              isOnCooldown:
                warriorAccount.cooldownExpiresAt.toNumber() > Date.now() / 1000,
              imageUri: warriorAccount.imageUri,
              imageRarity: getImageRarityName(warriorAccount.imageRarity),
              warriorClass: warriorClass,
            },
          };
        }

        retryCount++;
      } catch (fetchError: any) {
        console.log(
          `⚠️ Fetch failed on attempt ${retryCount + 1}: ${fetchError.message}`
        );
        retryCount++;
      }
    }

    // VRF timeout - provide fallback
    onProgress?.(
      { stage: "error", progress: 90 },
      "⚠️ VRF timeout - warrior created but stats pending..."
    );

    // Try one final fetch to get current state
    try {
      const warriorAccount = await program.account.undeadWarrior.fetch(
        warriorPda
      );

      if (warriorAccount.baseAttack > 0) {
        // VRF partially succeeded
        return {
          success: true,
          signature: tx,
          warrior: {
            name: warriorAccount.name,
            address: warriorAccount.address,
            owner: warriorAccount.owner,
            dna: warriorAccount.dna,
            createdAt: warriorAccount.createdAt,
            currentHp: warriorAccount.currentHp,
            baseAttack: warriorAccount.baseAttack,
            baseDefense: warriorAccount.baseDefense,
            baseKnowledge: warriorAccount.baseKnowledge,
            maxHp: warriorAccount.maxHp,
            battlesWon: warriorAccount.battlesWon,
            battlesLost: warriorAccount.battlesLost,
            experiencePoints: warriorAccount.experiencePoints,
            level: warriorAccount.level,
            lastBattleAt: warriorAccount.lastBattleAt,
            cooldownExpiresAt: warriorAccount.cooldownExpiresAt,
            imageIndex: warriorAccount.imageIndex,
            isOnCooldown:
              warriorAccount.cooldownExpiresAt.toNumber() > Date.now() / 1000,
            imageUri: warriorAccount.imageUri,
            imageRarity: getImageRarityName(warriorAccount.imageRarity),
            warriorClass: warriorClass,
          },
        };
      } else {
        // VRF failed but warrior exists
        return {
          success: true,
          signature: tx,
          error:
            "Warrior created but VRF stats are pending. This is a known issue on devnet - your warrior will update automatically when VRF completes.",
        };
      }
    } catch (finalFetchError) {
      return {
        success: false,
        error:
          "Warrior creation transaction succeeded but unable to verify stats. Please check your wallet for the transaction.",
      };
    }
  } catch (error: any) {
    console.error("Error creating warrior:", error);

    onProgress?.(
      { stage: "error", progress: 0 },
      `❌ Creation failed: ${error.message}`
    );

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

// Helper function to convert WarriorClass to program format
const getWarriorClassVariant = (warriorClass: WarriorClass) => {
  switch (warriorClass) {
    case WarriorClass.Validator:
      return { validator: {} };
    case WarriorClass.Oracle:
      return { oracle: {} };
    case WarriorClass.Guardian:
      return { guardian: {} };
    case WarriorClass.Daemon:
      return { daemon: {} };
    default:
      return { validator: {} }; // fallback
  }
};

// Helper function to get human-readable image rarity name
const getImageRarityName = (imageRarity: ImageRarity): any => {
  if (typeof imageRarity === "object") {
    const key = Object.keys(imageRarity)[0];
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  return imageRarity || "Common";
};

// Keep the simple DNA generator
export const generateRandomDNA = (): string => {
  const chars = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Warrior class information for UI
export const WARRIOR_CLASS_INFO = {
  [WarriorClass.Validator]: {
    title: "Validator",
    icon: "⚖️",
    description: "The undead Warrior of network consensus",
    traits: "Well-rounded combat capabilities",
    statDistribution: "Balanced ATK/DEF/KNOW",
    specialAbility: "Consensus Strike - Balanced damage output",
    lore: "Masters of network validation and Byzantine fault tolerance",
  },
  [WarriorClass.Oracle]: {
    title: "Oracle",
    icon: "🔮",
    description: "Mystical warrior with a Mega brain, lineage of Satoshi",
    traits: "High knowledge, moderate combat skills",
    statDistribution: "High KNOW, Moderate ATK/DEF",
    specialAbility: "Data Feed - Enhanced knowledge-based attacks and defense",
    lore: "These warriors knew about the birth of blockchain and cryptography",
  },
  [WarriorClass.Guardian]: {
    title: "Guardian",
    icon: "🛡️",
    description: "Stalwart defenders of the blockchain realm",
    traits: "Exceptional defense, moderate attack",
    statDistribution: "High DEF, Moderate ATK/KNOW",
    specialAbility: "Shield Wall - Superior defensive capabilities",
    lore: "Protectors who secure the network from all threats and hacks",
  },
  [WarriorClass.Daemon]: {
    title: "Daemon",
    icon: "⚡",
    description: "Aggressive background processes of destruction",
    traits: "High attack, low defense - glass cannon",
    statDistribution: "High ATK, Low DEF, Moderate KNOW",
    specialAbility: "Process Kill - Devastating but risky attacks",
    lore: "Relentless background warriors optimized for raw damage",
  },
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
