import { ApiDataCacheRoutes } from "@types";
import { usePoolsData } from "./usePoolData";
import { UseMintDataProps, UseTokenDataProps, useMetadataData, useMintData, useTokenData } from "./useTokenData";
import { UseAllVestingPositionsDataProps, useAllVestingPositionsData } from "./useVestingData";

type UseDataTypesMap = {
    [ApiDataCacheRoutes.GetAllPools]: [[], ReturnType<typeof usePoolsData>],
    [ApiDataCacheRoutes.GetMintInfo]: [UseMintDataProps, ReturnType<typeof useMintData>],
    [ApiDataCacheRoutes.GetTokenInfo]: [UseTokenDataProps, ReturnType<typeof useTokenData>],
    [ApiDataCacheRoutes.GetMetadata]: [UseMintDataProps, ReturnType<typeof useMetadataData>],
    [ApiDataCacheRoutes.GetAllVestingPositionsByUser]: [UseAllVestingPositionsDataProps, ReturnType<typeof useAllVestingPositionsData>]
}
  
type UseDataParams<K extends ApiDataCacheRoutes> = K extends keyof UseDataTypesMap ? UseDataTypesMap[K][0] : [];
type UseDataReturnType<K extends ApiDataCacheRoutes> = K extends keyof UseDataTypesMap ? UseDataTypesMap[K][1] : null;  

export function useData<
    K extends ApiDataCacheRoutes
> (
    key: K,
    ...params: UseDataParams<K>
): UseDataReturnType<K> {
    switch (key) {
        case ApiDataCacheRoutes.GetAllPools:
            return usePoolsData() as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetMintInfo:
            return useMintData(...params as UseMintDataProps) as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetTokenInfo:
            return useTokenData(...params as UseTokenDataProps) as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetMetadata:
            return useMetadataData(...params as UseMintDataProps) as UseDataReturnType<K>;
        case ApiDataCacheRoutes.GetAllVestingPositionsByUser:
            return useAllVestingPositionsData(...params as UseAllVestingPositionsDataProps) as UseDataReturnType<K>;
        default:
            return null as UseDataReturnType<K>;
    }      
}