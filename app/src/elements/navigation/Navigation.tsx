import { ElementRef, FC, useRef, useState } from "react";
import styles from './styles.module.css'
import { Logo } from "@assets";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { classJoiner } from "@utils";
import { useOutsideClick, useWidth } from "@hooks";

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

    const width = useWidth()

    if (width <= 660) return <MobileNavigation/>

    return (
        <div className={styles.navigation}>
            <Logo className={styles.logo}/>
            <div className={styles.menu_items}>
                <CurrentLink to={'/'} label="Staking"/>
                <CurrentLink to={'/vesting'} label="Vesting"/>
                <CurrentLink to={'/create'} label="Create Pool"/>
            </div>
            <WalletMultiButton/>
        </div>
    )
}

const MobileNavigation: FC = () => {

    const [expanded, setExpanded] = useState<boolean>(false)
    const switchExpanded = () => setExpanded(prev => !prev)
    const ref = useRef<ElementRef<"div">>(null)

    useOutsideClick(
        () => setExpanded(false),
        [ref]
    )

    return (
        <div className={styles.navigation} ref={ref}>
            <Logo className={styles.logo}/>
            <button className={styles.burger_button} onClick={switchExpanded}>
                {
                    expanded
                    ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <path d="M8 8L24 24M8 24L24 8" stroke="#000" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#000">
                        <path d="M25.5 23C26.052 23 26.5 23.4475 26.5 24C26.5 24.5525 26.052 25 25.5 25C25.1995 25 6.8005 25 6.5 25C5.948 25 5.5 24.5525 5.5 24C5.5 23.4475 5.948 23 6.5 23C6.8005 23 25.1995 23 25.5 23ZM25.5 15C26.052 15 26.5 15.4475 26.5 16C26.5 16.5525 26.052 17 25.5 17C25.1995 17 6.8005 17 6.5 17C5.948 17 5.5 16.5525 5.5 16C5.5 15.4475 5.948 15 6.5 15C6.8005 15 25.1995 15 25.5 15ZM25.5 7C26.052 7 26.5 7.4475 26.5 8C26.5 8.5525 26.052 9 25.5 9C25.1995 9 6.8005 9 6.5 9C5.948 9 5.5 8.5525 5.5 8C5.5 7.4475 5.948 7 6.5 7C6.8005 7 25.1995 7 25.5 7Z"/>
                    </svg>
                }
            </button>
            {
                expanded
                ?
                <div className={styles.mobile_navigation}>    
                    <div className={styles.menu_items}>
                        <CurrentLink to={'/'} label="Staking"/>
                        <CurrentLink to={'/vesting'} label="Vesting"/>
                        <CurrentLink to={'/create'} label="Create Pool"/>
                    </div>  
                    <WalletMultiButton/>
                </div>
                :
                null
            }
        </div>
    )
}