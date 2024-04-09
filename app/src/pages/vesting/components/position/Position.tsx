import { Button } from "@components";
import { useData, useTransaction } from "@hooks";
import { createClaimInstruction } from "@services";
import { ApiDataCacheRoutes, VestingPosition } from "@types";
import { NumberFormatter } from "@utils";
import { FC } from "react";
import styles from './styles.module.css';

type Props = {
    position: VestingPosition,
    mutate: () => any
}

export const Position: FC<Props> = ({
    position: { address, claimPerDay, lastClaimTimestamp, mint, owner, stakingPool },
    mutate
}) => {

    const { data: mintData } = useData(ApiDataCacheRoutes.GetMintInfo, mint)
    const { data: metadata } = useData(ApiDataCacheRoutes.GetMetadata, mint)

    const onClaim = useTransaction(
        (w) => createClaimInstruction(
            w,
            { address, claimPerDay, lastClaimTimestamp, mint, owner, stakingPool }
        ),
        `Claimed tokens successfully`,
        () => mutate(),
        undefined,
        {
            computeUnitsPrice: 5_000_000
        }
    )

    return (
        <div className={styles.wrapper}>
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
                    NumberFormatter.format(claimPerDay / mintData.denominator, "short")
                    :
                    '-'
                }
            </p>
            <div className={styles.action_wrapper}>
                <Button
                onClick={e => {
                    e.stopPropagation()
                    onClaim()
                }}
                >
                    Claim
                </Button>
            </div>
        </div>
    )
}