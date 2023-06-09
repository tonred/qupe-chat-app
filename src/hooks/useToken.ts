import { type Address } from 'everscale-inpage-provider'

import { type Token } from '@/types'
import { useTokenList } from '@/hooks/useTokenList'

export const useToken = (address: Address): Token | undefined => {
    for (const token of useTokenList()) {
        if (token.address.equals(address)) return token
    }
    return undefined
}
