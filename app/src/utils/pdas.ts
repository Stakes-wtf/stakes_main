import { PublicKey } from "@solana/web3.js"
import { programId } from "@constants"

class PDADerivation<T> {
    getSeeds: (...args: T[]) => Buffer[]

    constructor(getSeeds: (...args: T[]) => Buffer[]) {
        this.getSeeds = getSeeds
    }

    public deriveWithBump(...args: T[]) {
        return PublicKey.findProgramAddressSync(
            this.getSeeds(...args),
            programId
        )
    }

    public derive(...args: T[]) {
        return this.deriveWithBump(...args)[0]
    }
}

export const StakingPoolDerivation = new PDADerivation(
    (mint: PublicKey) => [Buffer.from("staking_pool"), mint.toBuffer()]
)
export const StakingVaultDerivation = new PDADerivation(
    (mint: PublicKey) => [Buffer.from("staking_vault"), StakingPoolDerivation.derive(mint).toBuffer()]
)
export const VestingVaultDerivation = new PDADerivation(
    (vestingPosition: PublicKey) => [Buffer.from("vesting_vault"), vestingPosition.toBuffer()]
)

export const deriveMetadataAddress = (mint: PublicKey) => PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(), mint.toBuffer()],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
)[0]