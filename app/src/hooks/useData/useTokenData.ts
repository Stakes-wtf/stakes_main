import { fetchMintDetails, fetchMintMetadata, fetchTokenAccountDetails } from "@services"
import { PublicKey } from "@solana/web3.js"
import { ApiDataCacheRoutes } from "@types"
import useSWR from "swr"

export type UseMintDataProps = [mint: string]

export function useMintData (...props: UseMintDataProps) {
    return useSWR(
        [ApiDataCacheRoutes.GetMintInfo, ...props],
        ([_, mint]) => fetchMintDetails(mint)
    )
}

export function useMetadataData (...props: UseMintDataProps) {
    return useSWR(
        [ApiDataCacheRoutes.GetMetadata, ...props],
        ([_, mint]) => fetchMintMetadata(mint)
    )
}

export type UseTokenDataProps = [address?: string]

export function useTokenData (...[address]: UseTokenDataProps) {
    return useSWR(
        address ? [ApiDataCacheRoutes.GetTokenInfo, address] : null,
        ([_, address]) => fetchTokenAccountDetails(address)
    )
}