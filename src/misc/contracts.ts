import { type Address, type FullContractState } from 'everscale-inpage-provider'

import { useStaticRpc } from '@/hooks'
import { resolveEverscaleAddress } from '@/utils'

const staticRpc = useStaticRpc()

export async function getFullContractState(
    address: Address | string,
): Promise<FullContractState | undefined> {
    try {
        return (await staticRpc.getFullContractState({ address: resolveEverscaleAddress(address) }))
            .state
    }
    catch (e) {
        return undefined
    }
}
