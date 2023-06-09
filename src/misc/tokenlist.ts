import { Address } from 'everscale-inpage-provider'

import { zeroAddress } from '@/utils'
import { type Token } from '@/types'


export const VENOM_DEVNET_TOKENS: Token[] = [
    {
        address: zeroAddress,
        decimals: 9,
        name: 'VENOM',
    },
    {
        address: new Address('0:6bf25d251adabf1268a8870ad1b45d46fcf782ef9f1bfa7c16032484d3e54ac7'),
        decimals: 9,
        name: 'WVENOM',
    },
]

export const EVER_TOKENS: Token[] = [
    {
        address: zeroAddress,
        decimals: 9,
        name: 'EVER',
    },
]
