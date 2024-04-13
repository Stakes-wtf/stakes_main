import { fetchAllVestingPositionsByUser } from "@services"
import { PublicKey } from "@solana/web3.js"
import { ApiDataCacheRoutes } from "@types"
import useSWR from "swr"

export type UseAllVestingPositionsDataProps = [address?: string]

export function useAllVestingPositionsData (...[address]: UseAllVestingPositionsDataProps) {
    return useSWR(
        address ? [ApiDataCacheRoutes.GetAllVestingPositionsByUser, address] : null,
        ([_, address]) => fetchAllVestingPositionsByUser(address)
    )
}