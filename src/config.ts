import { Address } from 'everscale-inpage-provider'

import EverLogo from '@/assets/icons/EVER.svg'
import { type NetworkConfiguration } from '@/types'

export const ROOT_ADDRESS = new Address(
    '0:4b434c9cb8583540fbfde8ca6e7b5a9518939000702a9a36a125dc4360529371',
)

export const EverscaleConfig = {
    attachedValues: {},
    connectionProperties: 'mainnetJrpc',
    explorer: {
        account: 'https://everscan.io/accounts/{{ADDR}}',
    },
    name: 'Everscale Mainnet',
    nativeCoinDecimals: 9,
    nativeCoinLogoURI: EverLogo,
    nativeCoinSymbol: 'EVER',
    networkId: 42,
} as NetworkConfiguration

export const LocalConfig = {
    attachedValues: {},
    connectionProperties: {
        data: {
            endpoints: ['https://net.ton.red/graphql'],
            latencyDetectionInterval: 1000,
            local: true,
        },
        group: 'localnet',
        id: 1,
        type: 'graphql',
    },
    explorer: {
        account: 'https://net.ton.red/accounts/accountDetails?id={{ADDR}}',
    },
    name: 'net.ton.red',
    nativeCoinDecimals: 9,
    nativeCoinLogoURI: EverLogo,
    nativeCoinSymbol: 'EVER',
    // networkId: 42,
    networkId: 0,
} as NetworkConfiguration

export const DefaultNetworkConfig = LocalConfig
