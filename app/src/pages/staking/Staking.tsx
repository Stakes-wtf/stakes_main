import { useData } from '@hooks'
import { ApiDataCacheRoutes } from '@types'
import { FC } from 'react'
import { ListTitle, Pool } from './components'
import styles from './styles.module.css'

export const StakingPage: FC = () => {

    const { data: pools, mutate } = useData(ApiDataCacheRoutes.GetAllPools)

    return (
        <div className={styles.wrapper}>
            <ListTitle/>
            {
                pools
                ?
                pools.map(p => <Pool pool={p} mutate={mutate} key={p.address.toBase58()}/>)
                :
                null
            }
        </div>
    )
}