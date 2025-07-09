import { PublicKey } from "@solana/web3.js";
import undeadIdl from "../idl/undead.json";

// Program ID for the Undead Warriors program on Devnet
export const PROGRAM_ID = new PublicKey(
  "2Nz59jhEqTAA1UAk8QYFEAU87YRm9M9satPYdfJCZkf4"
);

export const PROGRAM_IDL = undeadIdl;

export const authority = new PublicKey(
  "7gyjmugBPxx93NvdegiKz8JHeAaRYC8EbeFFuogWB9zX"
);
