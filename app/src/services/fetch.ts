import { connection, program } from "@constants";
import { getAccount, getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { MintInfo, MintMetadata, StakingPool, TokenAccountInfo, VestingPosition } from "@types";
import { deriveMetadataAddress } from "@utils";

export async function fetchAllPools (): Promise<StakingPool[]> {
    return program.account.stakingPool.all()
    .then(p => p.map(p => ({
        address: p.publicKey,
        activeBalance: p.account.activeBalance.toNumber(),
        govMint: p.account.govMint,
        mint: p.account.mint,
        lastBribeDistributionTimestamp: p.account.lastBribeDistributionTimestamp.toNumber(),
        govPrice: p.account.govPrice.toNumber()
    } as StakingPool)))
}

export async function fetchMintDetails (mint: string): Promise<MintInfo> {
    return getMint(connection, new PublicKey(mint))
    .then(m => ({
        supply: Number(m.supply.toString()),
        denominator: Math.pow(10, m.decimals)
    }))
}

export async function fetchTokenAccountDetails (tokenAddress: string): Promise<TokenAccountInfo> {
    return getAccount(connection, new PublicKey(tokenAddress))
    .then(a => ({
        amount: Number(a.amount.toString())
    }))
}

export async function fetchMintMetadata (mint: string): Promise<MintMetadata> {
    const info = await connection.getAccountInfo(deriveMetadataAddress(new PublicKey(mint)))
    if (!info) throw new Error("No metadata account")

    const name = Buffer.from([...info.data.slice(32 + 32 + 4, 1 + 32 + 32 + 4 + 32)].filter(b => b !== 0)).toString("utf-8")
    const uri = Buffer.from([...info.data.slice(32 + 32 + 4 + 32 + 4 + 10 + 4, 1 + 32 + 32 + 4 + 32 + 4 + 10 + 4 + 200)].filter(b => b !== 0)).toString("utf-8")
    
    const image = await fetch(uri)
    .then(d => d.json())
    .then(d => {
        return d.image || ''
    })
    .catch(() => '')

    return {
        name,
        image
    }
}

export async function fetchAllVestingPositionsByUser (wallet: string): Promise<VestingPosition[]> {
    return program.account.vestingPosition.all([
        {
            memcmp: {
                offset: 8 + 32,
                bytes: wallet
            }
        }
    ])
    .then(accs => accs.map(a => ({
        address: a.publicKey,
        claimPerDay: a.account.claimPerDay.toNumber(),
        lastClaimTimestamp: a.account.lastClaimTimestamp.toNumber(),
        mint: a.account.mint,
        owner: a.account.owner,
        stakingPool: a.account.stakingPool
    } as VestingPosition)))
}