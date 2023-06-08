import React, { type PropsWithChildren, useContext, useMemo } from 'react'
import { ChatRoot } from 'qupe-lib/dist/chat/root'

import { useRpc, useStaticRpc } from '@/hooks'
import { debug } from '@/utils'
import { ROOT_ADDRESS } from '@/config'

interface RootContextProps {
    root?: ChatRoot
}

const RootContext = React.createContext<RootContextProps>({
    root: undefined,
})

RootContext.displayName = 'RootContext'

export const RootContextProvider: React.FC<PropsWithChildren> = React.memo(props => {
    const root = useMemo(() => {
        const rpc = useStaticRpc()
        const userRpc = useRpc()
        const rootAddr = ROOT_ADDRESS
        debug('New Chat Root')
        // @ts-ignore
        const r = new ChatRoot(rpc, rootAddr)
        // @ts-ignore
        r.connectUserWallet(userRpc)
        return r
    }, [])

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <RootContext.Provider value={{ root }}>{props.children}</RootContext.Provider>
    )
})
RootContextProvider.displayName = 'RootContextProvider'

export function useRootContext(): RootContextProps {
    const context = useContext(RootContext)

    return context
}
