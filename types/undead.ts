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

// Warrior Class
export enum WarriorClass {
  Validator = "validator",
  Oracle = "oracle",
  Guardian = "guardian",
  Daemon = "daemon",
}

// Image Rarity
export enum ImageRarity {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
}

// Battle State
export enum BattleState {
  Created = "created",
  Joined = "joined",
  QuestionsSelected = "questionsSelected",
  ReadyForDelegation = "readyForDelegation",
  InProgress = "inProgress",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface AnchorUndeadWarrior {
  name: string;
  owner: PublicKey;
  dna: number[];
  createdAt: BN;
  baseAttack: number;
  baseDefense: number;
  baseKnowledge: number;
  currentHp: number;
  maxHp: number;
  warriorClass: WarriorClass;
  battlesWon: number;
  battlesLost: number;
  experiencePoints: BN;
  level: number;
  lastBattleAt: BN;
  cooldownExpiresAt: BN;
  bump: number;
  imageRarity: ImageRarity;
  imageIndex: number;
  imageUri: string;
  address: PublicKey;
}

export interface AnchorUserProfile {
  owner: PublicKey;
  warriorsCreated: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  totalBattlesFought: number;
  joinDate: BN;
  totalPoints: number;
  bump: number;
}

export interface AnchorGameConfig {
  admin: PublicKey;
  totalWarriors: BN;
  cooldownTime: BN;
  totalBattles: number;
  isPaused: boolean;
  createdAt: BN;
  bump: number;
}

export interface AnchorUserAchievements {
  owner: PublicKey;
  overallAchievements: AchievementLevel;
  warriorAchivement: AchievementLevel;
  winnerAchievement: AchievementLevel;
  battleAchievement: AchievementLevel;
  firstWarriorDate: BN;
  bump: number;
}

export interface AnchorBattleRoom {
  roomId: number[];
  createdAt: BN;
  playerA: PublicKey;
  playerB: PublicKey | null;
  warriorA: PublicKey;
  warriorB: PublicKey | null;
  selectedConcepts: number[]; // [u8; 5]
  selectedTopics: number[]; // [u8; 10]
  selectedQuestions: number[]; // [u16; 10]
  correctAnswers: boolean[]; // [bool; 10]
  state: BattleState;
  playerAReady: boolean;
  playerBReady: boolean;
  currentQuestion: number;
  playerAAnswers: (boolean | null)[]; // [Option<bool>; 10]
  playerBAnswers: (boolean | null)[]; // [Option<bool>; 10]
  playerACorrect: number;
  playerBCorrect: number;
  winner: PublicKey | null;
  battleDuration: number;
  bump: number;
  battleStartTime: BN;
}

export interface AnchorLeaderboard {
  topPlayers: PublicKey[]; // [pubkey; 20]
  topScores: number[]; // [u32; 20]
  lastUpdated: BN;
  bump: number;
}

// Utility interface for program accounts
export interface ProgramAccount<T> {
  publicKey: PublicKey;
  account: T;
}

// Processed/formatted types for frontend use
export interface Warrior {
  name: string;
  owner: PublicKey;
  dna: number[];
  createdAt: BN;
  baseAttack: number;
  baseDefense: number;
  baseKnowledge: number;
  currentHp: number;
  maxHp: number;
  warriorClass: WarriorClass;
  battlesWon: number;
  battlesLost: number;
  experiencePoints: BN;
  level: number;
  lastBattleAt: BN;
  cooldownExpiresAt: BN;
  imageRarity: ImageRarity;
  imageIndex: number;
  imageUri: string;
  isOnCooldown: boolean;
  address: PublicKey;
}

export interface UserProfile {
  owner: PublicKey;
  warriorsCreated: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  totalBattlesFought: number;
  joinDate: BN;
  totalPoints: number;
}

export interface GameConfig {
  admin: PublicKey;
  totalWarriors: BN;
  cooldownTime: BN;
  totalBattles: number;
  isPaused: boolean;
  createdAt: BN;
}

export interface UserAchievements {
  owner: PublicKey;
  overallAchievements: AchievementLevel;
  warriorAchivement: AchievementLevel;
  winnerAchievement: AchievementLevel;
  battleAchievement: AchievementLevel;
  firstWarriorDate: BN;
}

export interface BattleRoom {
  address: PublicKey;
  roomId: number[];
  createdAt: BN;
  playerA: PublicKey;
  playerB: PublicKey | null;
  warriorA: PublicKey;
  warriorB: PublicKey | null;
  selectedConcepts: number[];
  selectedTopics: number[];
  selectedQuestions: number[];
  correctAnswers: boolean[];
  state: BattleState;
  playerAReady: boolean;
  playerBReady: boolean;
  currentQuestion: number;
  playerAAnswers: (boolean | null)[];
  playerBAnswers: (boolean | null)[];
  playerACorrect: number;
  playerBCorrect: number;
  winner: PublicKey | null;
  battleDuration: number;
  battleStartTime: BN;
  // Computed properties
  isWaitingForPlayers: boolean;
  canStart: boolean;
  currentQuestionIndex: number;
}

export interface Leaderboard {
  topPlayers: PublicKey[];
  topScores: number[];
  lastUpdated: BN;
}

// Type guards for better type safety
export const isWarriorClass = (value: string): value is WarriorClass => {
  return Object.values(WarriorClass).includes(value as WarriorClass);
};

export const isBattleState = (value: string): value is BattleState => {
  return Object.values(BattleState).includes(value as BattleState);
};

export const isAchievementLevel = (
  value: string
): value is AchievementLevel => {
  return Object.values(AchievementLevel).includes(value as AchievementLevel);
};

export const convertToBattleRoom = (
  address: PublicKey,
  anchor: AnchorBattleRoom
): BattleRoom => {
  const isWaitingForPlayers = anchor.playerB === null;
  const canStart =
    anchor.playerAReady &&
    anchor.playerBReady &&
    anchor.state === BattleState.QuestionsSelected;

  return {
    address,
    roomId: anchor.roomId,
    createdAt: anchor.createdAt,
    playerA: anchor.playerA,
    playerB: anchor.playerB,
    warriorA: anchor.warriorA,
    warriorB: anchor.warriorB,
    selectedConcepts: anchor.selectedConcepts,
    selectedTopics: anchor.selectedTopics,
    selectedQuestions: anchor.selectedQuestions,
    correctAnswers: anchor.correctAnswers,
    state: anchor.state,
    playerAReady: anchor.playerAReady,
    playerBReady: anchor.playerBReady,
    currentQuestion: anchor.currentQuestion,
    playerAAnswers: anchor.playerAAnswers,
    playerBAnswers: anchor.playerBAnswers,
    playerACorrect: anchor.playerACorrect,
    playerBCorrect: anchor.playerBCorrect,
    winner: anchor.winner,
    battleDuration: anchor.battleDuration,
    battleStartTime: anchor.battleStartTime,
    isWaitingForPlayers,
    canStart,
    currentQuestionIndex: anchor.currentQuestion,
  };
};
