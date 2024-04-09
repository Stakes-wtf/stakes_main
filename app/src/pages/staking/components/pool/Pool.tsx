import { FC, useEffect, useMemo, useState } from "react";
import styles from './styles.module.css'
import { ApiDataCacheRoutes, StakingPool } from "@types";
import { NumberFormatter } from "@utils";
import { useData, useTransaction } from "@hooks";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@components";
import { createBribeInstruction, createStakeInstruction, createUnstakeInstruction } from "@services";

type Props = {
    pool: StakingPool,
    mutate: () => any
}

export const Pool: FC<Props> = ({
    pool: { govMint, mint, activeBalance, govPrice, address, lastBribeDistributionTimestamp },
    mutate
}) => {

    const [expanded, setExpanded] = useState(false)
    const [stakeInput, setStakeInput] = useState<number | undefined>(undefined)
    const [bribeInput, setBribeInput] = useState<number | undefined>(undefined)
    const { publicKey } = useWallet()

    const govAta = useMemo(() => {
        if (!publicKey) return undefined
        return getAssociatedTokenAddressSync(govMint, publicKey)
    }, [publicKey])

    const { data: mintData } = useData(ApiDataCacheRoutes.GetMintInfo, mint)
    const { data: govData } = useData(ApiDataCacheRoutes.GetMintInfo, govMint)
    const { data: metadata } = useData(ApiDataCacheRoutes.GetMetadata, mint)
    const { data: govToken, mutate: mutateGovToken } = useData(ApiDataCacheRoutes.GetTokenInfo, govAta)

    const onBribe = useTransaction(
        (w) => createBribeInstruction(
            w,
            { govMint, mint, activeBalance, govPrice, address, lastBribeDistributionTimestamp },
            bribeInput! * mintData!.denominator
        ),
        () => `Bribed ${NumberFormatter.format(bribeInput!, "short")} tokens successfully`,
        undefined,
        () => bribeInput !== undefined && bribeInput > 0 && mintData !== undefined,
        {
            computeUnitsPrice: 5_000_000
        }
    )

    const onStake = useTransaction(
        (w) => createStakeInstruction(
            w,
            { govMint, mint, activeBalance, govPrice, address, lastBribeDistributionTimestamp },
            stakeInput! * mintData!.denominator
        ),
        () => `Staked ${NumberFormatter.format(stakeInput!, "short")} tokens successfully`,
        () => {
            mutateGovToken()
            mutate()
        },
        () => stakeInput !== undefined && stakeInput > 0 && mintData !== undefined,
        {
            computeUnitsPrice: 5_000_000
        }
    )

    const onUnstake = useTransaction(
        (w) => createUnstakeInstruction(
            w,
            { govMint, mint, activeBalance, govPrice, address, lastBribeDistributionTimestamp }
        ),
        `Unstaked tokens successfully`,
        () => {
            mutateGovToken()
            mutate()
        },
        undefined,
        {
            computeUnitsPrice: 5_000_000
        }
    )

    return (
        <div className={styles.wrapper} onClick={() => setExpanded(prev => !prev)}>
            <div className={styles.mint_info}>
                <div className={styles.avatar}>
                    {
                        metadata
                        ?
                        <img src={metadata.image}/>
                        :
                        null
                    }
                </div>
                <p>
                    {
                        metadata
                        ?
                        metadata.name
                        :
                        <>{mint.toBase58().slice(0, 4)}...{mint.toBase58().slice(-4)}</>
                    }
                </p>
            </div>
            <p>
                {
                    mintData
                    ?
                    NumberFormatter.format(activeBalance / mintData.denominator, "short")
                    :
                    '-'
                }
            </p>
            <p>
                {
                    govToken && govData
                    ?
                    NumberFormatter.format(govToken.amount / govData.denominator, "short")
                    :
                    '-'
                }
            </p>
            <p>
                {
                    govToken && mintData
                    ?
                    NumberFormatter.format((govToken.amount * 1_000_000_000 / govPrice) / mintData.denominator, "short")
                    :
                    '-'
                }
            </p>
            {
                expanded
                ?
                <>
                <span/>
                <div className={styles.action_wrapper}>
                    <input 
                    type={"number"} 
                    onClick={e => e.stopPropagation()}
                    value={bribeInput ? bribeInput.toString() : ''}
                    onChange={e => setBribeInput(isNaN(Number(e.target.value)) ? undefined : e.target.valueAsNumber)}
                    />
                    <Button
                    onClick={e => {
                        e.stopPropagation()
                        onBribe()
                    }}
                    disabled={!bribeInput}
                    >
                        Bribe
                    </Button>
                </div>
                <div className={styles.action_wrapper}>
                    <input 
                    type={"number"} 
                    onClick={e => e.stopPropagation()}
                    value={stakeInput ? stakeInput.toString() : ''}
                    onChange={e => setStakeInput(isNaN(Number(e.target.value)) ? undefined : e.target.valueAsNumber)}
                    />
                    <Button
                    onClick={e => {
                        e.stopPropagation()
                        onStake()
                    }}
                    disabled={!stakeInput}
                    >
                        Stake
                    </Button>
                </div>
                <div className={styles.action_wrapper}>
                    <Button
                    onClick={e => {
                        e.stopPropagation()
                        onUnstake()
                    }}
                    disabled={!govToken || govToken.amount === 0}
                    >
                        Unstake
                    </Button>
                </div>
                </>
                :
                null
            }
        </div>
    )
}