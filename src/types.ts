import { type ConnectionProperties } from 'everscale-standalone-client/client/ConnectionController'

export type NetworkConfiguration = {
    attachedValues: Map<string, number>
    connectionProperties: ConnectionProperties
    nativeCoinDecimals: number
    nativeCoinLogoURI: string
    nativeCoinSymbol: string
    name: string
    networkId: number
    explorer: {
        account: string
    }
}
