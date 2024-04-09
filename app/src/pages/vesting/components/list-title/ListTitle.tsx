import { FC } from "react";
import styles from './styles.module.css'

export const ListTitle: FC = () => {

    return (
        <div className={styles.wrapper}>
            <p>Token</p>
            <p>Claim Per Day</p>
            <span/>
        </div>
    )
}