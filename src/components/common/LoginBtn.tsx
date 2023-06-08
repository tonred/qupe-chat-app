import React, { useCallback } from 'react'
import { LoginOutlined } from '@ant-design/icons'

import { useWallet } from '@/stores/WalletService'
import { useUserContext } from '@/context/UserContext'

export const LoginBtn: React.FC = React.memo(() => {
    const wallet = useWallet()
    const { disconnect } = useUserContext()
    const onDisconnect = useCallback(() => {
        disconnect()
        wallet.disconnect()
    }, [wallet, disconnect])
    return (
        <LoginOutlined
            className="text-2xl text-gray-600 dark:text-white cursor-pointer"
            onClick={onDisconnect}
        />
    )
})
LoginBtn.displayName = 'LoginBtn'
