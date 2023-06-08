import {
    type Provider,
    ProviderNotInitializedException,
    ProviderRpcClient,
} from 'everscale-inpage-provider'

import { debug } from '@/utils'

type ConnectorWallet = {
    title: string
    injected: {
        object: string
        flag?: string
        event?: string
    }
}

type ConnectorParams = {
    supportedWallets: ConnectorWallet[]
}
let ensurePageLoaded: Promise<void>
if (document.readyState === 'complete') {
    ensurePageLoaded = Promise.resolve()
}
else {
    ensurePageLoaded = new Promise<void>(resolve => {
        window.addEventListener('load', () => {
            resolve()
        })
    })
}
let rpc: ProviderRpcClient

class ProviderProxy implements Provider {

    inner?: Provider

    request(data: any): any {
        if (this.inner == null) {
            throw new ProviderNotInitializedException()
        }
        else {
            return this.inner.request(data)
        }
    }

    addListener(eventName: any, listener: any): any {
        this.inner?.addListener(eventName, listener)
        return this
    }

    removeListener(eventName: any, listener: any): any {
        this.inner?.removeListener(eventName, listener)
        return this
    }

    on(eventName: any, listener: any): any {
        this.inner?.on(eventName, listener)
        return this
    }

    once(eventName: any, listener: any): any {
        this.inner?.once(eventName, listener)
        return this
    }

    prependListener(eventName: any, listener: any): any {
        this.inner?.prependListener(eventName, listener)
        return this
    }

    prependOnceListener(eventName: any, listener: any): any {
        this.inner?.prependOnceListener(eventName, listener)
        return this
    }

}

class Connector {

    private readonly provider: ProviderProxy = new ProviderProxy()

    private providerPromise?: Promise<Provider>

    constructor(private readonly params: ConnectorParams) {}

    public asProviderFallback(): () => Promise<Provider> {
        return () => {
            if (this.providerPromise == null) {
                this.providerPromise = new Promise<void>(resolve => {
                    const onSelect = (provider: Provider): void => {
                        this.provider.inner = provider
                        resolve()
                    }

                    if (this.selectProvider(onSelect)) {
                        return
                    }

                    ensurePageLoaded.then(() => {
                        if (this.selectProvider(onSelect)) {
                            return
                        }

                        for (const { injected } of this.params.supportedWallets) {
                            if (
                                injected.flag != null
                                && injected.event != null
                                // @ts-ignore
                                && window[injected.flag] === true
                            ) {
                                window.addEventListener(injected.event, _ => {
                                    this.selectProvider(onSelect)
                                })
                            }
                        }
                    })
                }).then(() => this.provider)
            }
            return this.providerPromise
        }
    }

    selectProvider(onSelect: (provider: Provider) => void): boolean {
        if (this.provider.inner != null) {
            return true
        }

        const providers = this.getProviders()
        if (providers.length === 0) {
            return false
        }
        if (providers.length === 1) {
            onSelect(providers[0].provider)
            return true
        }
        onSelect(providers.find(value => value.wallet.injected.object === '__venom')!.provider)

        return true
    }

    getProviders(): { provider: Provider; wallet: ConnectorWallet }[] {
        const providers = new Array<{ provider: Provider; wallet: ConnectorWallet }>()

        for (const wallet of this.params.supportedWallets) {
            const { object } = wallet.injected
            // @ts-ignore
            const provider = window[object]
            if (provider != null) {
                providers.push({
                    provider,
                    wallet,
                })
            }
        }

        return providers
    }

}

const connector = new Connector({
    supportedWallets: [
        {
            injected: {
                event: 'ever#initialized',
                object: '__ever',
            },
            title: 'EVER Wallet',
        },
        {
            injected: {
                object: '__venom',
            },
            title: 'VENOM Wallet',
        },
    ],
})

export function useRpc(): ProviderRpcClient {
    if (rpc === undefined) {
        debug(
            '%cCreated a new one ProviderRpcClient instance as global connection to the EVER Wallet',
            'color: #bae701',
        )
        rpc = new ProviderRpcClient({
            fallback: connector.asProviderFallback(),
            forceUseFallback: true,
        })
    }
    return rpc
}
