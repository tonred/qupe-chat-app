import React, {
    type PropsWithChildren, useCallback, useContext, useEffect, useState,
} from 'react'
import { type ChatProfile } from 'qupe-lib/dist/chat/profile'
import { reaction } from 'mobx'
import { type Subscription } from 'everscale-inpage-provider'

import { useRootContext } from '@/context/RootContext'
import { useWallet } from '@/stores/WalletService'
import { useRpc } from '@/hooks'
import { debug } from '@/utils'

const rpc = useRpc()

interface UserState {
    profile?: ChatProfile
    jointServers: Map<number, boolean>
    balance: string
    isDeployed: boolean
    subscription?: Subscription<'contractStateChanged'>
}

interface UserContextProps {
    userState: UserState
    disconnect: () => void
    update: () => Promise<void>
}

const DEFAULT_USER_STATE = {
    balance: '9999999999',
    isDeployed: false,
    jointServers: new Map(),
    profile: undefined,
    subscription: undefined,
} as UserState
const UserContext = React.createContext<UserContextProps>({
    disconnect: () => debug('disconnect'),
    update: () => Promise.resolve(undefined),
    userState: DEFAULT_USER_STATE,
})

UserContext.displayName = 'UserContext'

export const UserContextProvider: React.FC<PropsWithChildren> = React.memo(props => {
    const { root } = useRootContext()
    const wallet = useWallet()
    const [userState, setUserState] = useState<UserState>(DEFAULT_USER_STATE)
    const disconnect = useCallback(() => {
        debug('UserContextProvider disconnect')
        setUserState(DEFAULT_USER_STATE)
    }, [])
    const update = useCallback(async () => {
        if (!userState.profile) return
        debug('forceUpdate')
        await userState.profile.update()
        setUserState({
            ...userState,
            isDeployed: userState.profile?.isDeployed || userState.isDeployed,
            jointServers: userState.profile!.jointServers,
            profile: userState.profile,
        })
    }, [userState.profile])
    useEffect(() => {
        reaction(
            () => wallet.account?.address,
            account => {
                // @ts-ignore
                if (!root) return
                if (!account) {
                    return
                }
                debug('New User Profile', account.toString())
                // @ts-ignore
                root.getProfile(account).then(p => {
                    // @ts-ignore
                    p.connectUserWallet(rpc)
                    setUserState({
                        ...userState,
                        profile: p,
                    })
                })
            },
        )
    }, [])

    useEffect(() => {
        if (!root || !wallet.account) return
        const subscribe = async (): Promise<void> => {
            if (!userState.profile) return
            debug('New User profile subscription')
            const state = await userState.profile?.getState()
            const sub = await userState.profile.subscribe(() => {
                debug('New User event')
                if (!userState.profile) return
                setUserState(prev => ({
                    ...prev,
                    balance: userState.profile!.balance,
                    isDeployed: userState.profile!.isDeployed,
                    jointServers: userState.profile!.jointServers,
                    profile: userState.profile,
                }))
            })

            if (!state) return

            setUserState({
                ...userState,
                balance: state.balance,
                isDeployed: state.isDeployed,
                jointServers: userState.profile.jointServers,
                // @ts-ignore
                subscription: sub,
            })
        }
        // eslint-disable-next-line no-void
        void subscribe()
    }, [userState.profile])

    return (
        <UserContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                disconnect,
                update,
                userState,
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
})
UserContextProvider.displayName = 'UserContextProvider'

export function useUserContext(): UserContextProps {
    const context = useContext(UserContext)

    return context
}
