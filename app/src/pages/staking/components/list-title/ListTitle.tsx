import { FC } from "react";
import styles from './styles.module.css'

export const ListTitle: FC = () => {

    return (
        <div className={styles.wrapper}>
            <p>Token</p>
            <p>TVL</p>
            <p>APR</p>
            <p>Your Stake</p>
            <p>Claimable</p>
        </div>
    )
}