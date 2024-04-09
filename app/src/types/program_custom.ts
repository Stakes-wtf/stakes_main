import { PublicKey } from "@solana/web3.js"

export type StakingPool = {
    address: PublicKey,
    mint: PublicKey,
    govMint: PublicKey,
    activeBalance: number,
    lastBribeDistributionTimestamp: number,
    govPrice: number
}

export type MintInfo = {
    supply: number,
    denominator: number
}

export type TokenAccountInfo = {
    amount: number
}

export type MintMetadata = {
    image: string,
    name: string
}

export type VestingPosition = {
    address: PublicKey,
    stakingPool: PublicKey,
    owner: PublicKey,
    mint: PublicKey,
    lastClaimTimestamp: number,
    claimPerDay: number
}