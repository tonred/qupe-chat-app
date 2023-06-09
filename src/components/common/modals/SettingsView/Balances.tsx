import React, { useCallback, useEffect, useState } from 'react'
import { Address } from 'everscale-inpage-provider'
import BigNumber from 'bignumber.js'

import { useUserContext } from '@/context/UserContext'
import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import { zeroAddress } from '@/utils'
import { useToken } from '@/hooks/useToken'
import { BalanceItem } from '@/components/common/BalanceItem'

export const BalancesAccount: React.FC = React.memo(() => {
    const [loading, setLoading] = useState(false)
    // const wallet = useWallet()
    const { userState, update } = useUserContext()
    const { profile } = userState
    const [balances, setBalances] = useState<React.JSX.Element[]>([])
    if (!profile) {
        return null
    }
    const onAction = useCallback((isWithdraw: boolean, address: string, amount: string) => {
        setLoading(true)
        const tokenAddress = new Address(address)
        const token = useToken(tokenAddress)
        let parsedAmount = new BigNumber(amount).shiftedBy(token?.decimals || 0)
        if (isWithdraw) {
            profile.withdrawNative(parsedAmount.toString(), () => {
                update().then(() => setLoading(false))
            }).catch(() => setLoading(false))
        }
        else {
            if (tokenAddress.equals(zeroAddress)) {
                parsedAmount = parsedAmount.plus(100_000_000)
            }
            profile.depositNative(parsedAmount.toString(), () => {
                update().then(() => setLoading(false))
            }).catch(() => setLoading(false))
        }
    }, [profile])

    useEffect(() => {
        const _balances: React.JSX.Element[] = []
        if (userState.profile?.balances.size === 0) {
            userState.profile?.balances.set(zeroAddress.toString(), '0')
        }
        userState.profile?.balances.forEach((value, key, _map) => {
            _balances.push(
                <BalanceItem
                    disabled={loading}
                    // eslint-disable-next-line react/no-array-index-key
                    key={key}
                    address={key}
                    balance={value}
                    onAction={onAction}
                />,
            )
        })
        setBalances(_balances)
    }, [userState.profile, onAction, loading])
    return (
        <div>
            <FullModalCommonTitle>Tokens balance</FullModalCommonTitle>
            <div className="w-full flex flex-wrap">
                {balances}
            </div>

        </div>
    )
})
BalancesAccount.displayName = 'BalancesAccount'
