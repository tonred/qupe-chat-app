import { type ConnectionProperties } from 'everscale-standalone-client/client/ConnectionController'
import { type Address } from 'everscale-inpage-provider'

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
    tokenList: Token[]
}

export interface Token {
    address: Address,
    name: string,
    decimals: number
}
