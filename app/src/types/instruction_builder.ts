import { Keypair, TransactionInstruction } from "@solana/web3.js"

export type InstructionBuilderResponse = {
    instructions: TransactionInstruction[],
    signers: Keypair[]
}