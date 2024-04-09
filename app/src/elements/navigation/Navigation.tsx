import { FC } from "react";
import styles from './styles.module.css'
import { Logo } from "@assets";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { classJoiner } from "@utils";

type CurrentLinkProps = {
    to: string,
    label: string
}

const CurrentLink: FC<CurrentLinkProps> = ({
    to, label
}) => {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname })

    return (
        <Link to={to}>
            <button className={classJoiner(styles.menu_item, (isActive ? styles.active : ''))}>
                <p>{label}</p>
            </button>
        </Link>
    )
}

export const Navigation: FC = () => {

    return (
        <div className={styles.navigation}>
            <Logo className={styles.logo}/>
            <div className={styles.menu_items}>
                <CurrentLink to={'/'} label="Staking"/>
                <CurrentLink to={'/vesting'} label="Vesting"/>
                <CurrentLink to={'/create'} label="Create new pool"/>
            </div>
            <WalletMultiButton/>
        </div>
    )
}