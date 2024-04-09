import { fetchAllPools } from "@services"
import { ApiDataCacheRoutes } from "@types"
import useSWR from "swr"

export function usePoolsData () {
    return useSWR(
        [ApiDataCacheRoutes.GetAllPools],
        () => fetchAllPools()
    )
}