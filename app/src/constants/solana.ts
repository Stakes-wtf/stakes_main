import { Program } from "@coral-xyz/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js"
import { IDL, StakesWtf } from "@types"

export const endpointUrl = import.meta.env.VITE_RPC_URL
export const connection = new Connection(endpointUrl, "confirmed")

export const programId = new PublicKey('stkWEMeJyUyoqZu6C65z21Vzt3CezXRuix7oqJ78RwS')
export const program = new Program<StakesWtf>(IDL, programId, { connection })

export const systemProgram = SystemProgram.programId
export const tokenProgram = TOKEN_PROGRAM_ID
export const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID