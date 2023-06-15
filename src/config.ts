import { Address } from 'everscale-inpage-provider'

import EverLogo from '@/assets/icons/EVER.svg'
import { type NetworkConfiguration } from '@/types'
import { EVER_TOKENS, VENOM_DEVNET_TOKENS } from '@/misc/tokenlist'

export const ROOT_ADDRESS = new Address(
    '0:b181589895e3325c33d7dbb453c59617e113c7b1e0ccdba18f3e5f3ee670b4a5',
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
    tokenList: EVER_TOKENS,
} as NetworkConfiguration

export const DevnetVenomConfig = {
    attachedValues: {},
    connectionProperties: {
        data: {
            endpoint: 'https://jrpc-devnet.venom.foundation/rpc',
        },
        group: 'dev',
        id: 1000,
        type: 'jrpc',
    },
    explorer: {
        account: 'https://devnet.venomscan.com/accounts/{{ADDR}}',
    },
    name: 'Venom Devnet',
    nativeCoinDecimals: 9,
    nativeCoinSymbol: 'VENOM',
    networkId: 1002,
    tokenList: VENOM_DEVNET_TOKENS,
} as NetworkConfiguration

export const BroxusTestnetConfig = {
    attachedValues: {},
    connectionProperties: {
        data: {
            endpoint: 'https://jrpc-broxustestnet.everwallet.net/rpc',
        },
        group: 'dev',
        id: 1337,
        type: 'jrpc',
    },
    explorer: {
        account: 'https://broxustestnet.everscan.io/accounts/{{ADDR}}',
    },
    name: 'Broxus Testnet',
    nativeCoinDecimals: 9,
    nativeCoinSymbol: 'EVEER',
    networkId: 1337,
    tokenList: VENOM_DEVNET_TOKENS,
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
    tokenList: EVER_TOKENS,
} as NetworkConfiguration

export const DefaultNetworkConfig = BroxusTestnetConfig
