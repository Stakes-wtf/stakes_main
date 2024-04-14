import { useData } from '@hooks'
import { ApiDataCacheRoutes } from '@types'
import { FC } from 'react'
import { ListTitle, Position } from './components'
import styles from './styles.module.css'
import { useWallet } from '@solana/wallet-adapter-react'

export const VestingPage: FC = () => {

    const { publicKey } = useWallet()
    const { data: positions, mutate } = useData(ApiDataCacheRoutes.GetAllVestingPositionsByUser, publicKey?.toBase58() || undefined)

    return (
        <div className={styles.wrapper}>
            <ListTitle/>
            {
                positions
                ?
                positions.map(p => <Position position={p} mutate={mutate} key={p.address.toBase58()}/>)
                :
                null
            }
        </div>
    )
}