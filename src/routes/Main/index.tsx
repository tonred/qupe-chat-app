import React, { useCallback } from 'react'
import { Observer } from 'mobx-react-lite'
import { Navigate, Route, Routes } from 'react-router-dom'

import './index.css'

import PermanentAlert from '@/components/common/PermanentAlert'
import { useWallet } from '@/stores/WalletService'
import { DefaultNetworkConfig } from '@/config'
import MainChat from '@/routes/Main/Chat'
import { useUserContext } from '@/context/UserContext'
import { useRpc } from '@/hooks'
import { useRootContext } from '@/context/RootContext'
import { openModal } from '@/components/common/Modal'
import { ModalCreateProfile } from '@/components/common/modals/CreateProfile'
import { error } from '@/utils'

const MainRoute = React.memo(() => {
    const wallet = useWallet()
    const { userState } = useUserContext()
    const rpc = useRpc()
    const { root } = useRootContext()
    const handleDeployProfileClick = useCallback(() => {
        if (wallet.account && root) {
            openModal(<ModalCreateProfile />)
        }
    }, [root])
    return (
        <div className="flex flex-col h-full">
            <Observer>
                {() => {
                    if (wallet.isConnected) {
                        if (wallet.networkId !== DefaultNetworkConfig.networkId) {
                            return (
                                <PermanentAlert bgColor="bg-red-700">
                                    <h2 className="p-1">
                                        Wrong network selected, expected network is
                                        {' '}
                                        <b>{DefaultNetworkConfig.name}</b>
                                    </h2>
                                </PermanentAlert>
                            )
                        }
                        if (!userState.profile || !userState.profile.isDeployed) {
                            return (
                                <PermanentAlert bgColor="bg-red-700">
                                    <h2 className="p-1">
                                        <button
                                            className="underline"
                                            onClick={handleDeployProfileClick}
                                        >
                                            Deploy Profile
                                        </button>
                                    </h2>
                                </PermanentAlert>
                            )
                        }
                        if (userState.profile && Number(userState.balance) < 1_000_000_000) {
                            return (
                                <PermanentAlert bgColor="bg-red-700">
                                    <h2 className="p-1">
                                        Too low profile gas balance
                                        {' '}
                                        <button
                                            className="underline"
                                            onClick={() => {
                                                if (!wallet.account) return
                                                rpc.sendMessage({
                                                    amount: '5000000000',
                                                    bounce: false,
                                                    // @ts-ignore
                                                    recipient: userState.profile.address,
                                                    sender: wallet.account.address,
                                                }).catch(e => {
                                                    error(e)
                                                })
                                            }}
                                        >
                                            Top Up
                                        </button>
                                    </h2>
                                </PermanentAlert>
                            )
                        }
                    }
                    else {
                        return (
                            <PermanentAlert>
                                <button
                                    disabled={wallet.isConnecting}
                                    className="underline text-xl p-1"
                                    onClick={wallet.connect}
                                >
                                    Connect wallet to use dApp
                                </button>
                            </PermanentAlert>
                        )
                    }
                    return null
                }}
            </Observer>
            <div className="flex flex-1 overflow-hidden">
                <Routes>
                    <Route path="/c/:serverId/:roomId" element={<MainChat />} />
                    <Route path="/" element={<Navigate to="c/0/-1" replace />} />
                </Routes>
            </div>
        </div>
    )
})
MainRoute.displayName = 'MainRoute'

export default MainRoute
