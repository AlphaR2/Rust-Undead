import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

// Achievement Level
export enum AchievementLevel {
  None = "none",
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
  Diamond = "diamond",
}

// Raw Anchor account types
export interface AnchorUndeadWarrior {
  name: string;
  dna: string;
  owner: PublicKey;
  powerLevel: number;
  createdAt: BN;
  battleWins: number;
  battlesFought: number;
  experiencePoints: BN;
}

export interface AnchorUserProfile {
  owner: PublicKey;
  warriorsCreated: number;
  totalBattlesWon: number;
  totalBattlesFought: number;
  joinDate: BN;
}

export interface AnchorGameConfig {
  admin: PublicKey;
  totalWarriorsCreated: number;
  totalBattlesFought: number;
  initializedAt: BN;
  isPaused: boolean;
}

export interface AnchorUserAchievements {
  owner: PublicKey;
  warriorCreator: AchievementLevel;
  battleWinner: AchievementLevel;
  battleFighter: AchievementLevel;
  firstWarriorDate: BN;
  firstVictoryDate: BN;
  totalScore: BN;
}

export interface ProgramAccount<T> {
  publicKey: PublicKey;
  account: T;
}

export interface Warrior {
  name: string;
  dna: string;
  owner: PublicKey;
  powerLevel: number;
  createdAt: number;
  battleWins: number;
  battlesFought: number;
  experiencePoints: number;
  address: PublicKey;
}

export interface UserProfile {
  owner: PublicKey;
  warriorsCreated: number;
  totalBattlesWon: number;
  totalBattlesFought: number;
  joinDate: number;
}

export interface GameConfig {
  admin: PublicKey;
  totalWarriorsCreated: number;
  totalBattlesFought: number;
  initializedAt: number;
  isPaused: boolean;
}

export interface UserAchievements {
  owner: PublicKey;
  warriorCreator: AchievementLevel;
  battleWinner: AchievementLevel;
  battleFighter: AchievementLevel;
  firstWarriorDate: number;
  firstVictoryDate: number;
  totalScore: number;
}
