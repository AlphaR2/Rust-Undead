import { PublicKey } from "@solana/web3.js";
import undeadIdl from "../idl/undead.json";

// Program ID for the Undead Warriors program on Devnet
export const PROGRAM_ID = new PublicKey(
  "EZcvBzT1Vje7DxU8pi8YRwKsRzBv47v3q5cGmQUpPpNb"
);

export const PROGRAM_IDL = undeadIdl;
