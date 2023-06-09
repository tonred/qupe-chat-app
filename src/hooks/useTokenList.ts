import { type Token } from '@/types'
import { DefaultNetworkConfig } from '@/config'

export const useTokenList = (): Token[] => DefaultNetworkConfig.tokenList
