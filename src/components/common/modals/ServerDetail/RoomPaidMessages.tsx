import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'
import { Button, Divider } from 'antd'
import BigNumber from 'bignumber.js'
import { cloneDeep } from 'lodash'

import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import { BalanceItem } from '@/components/common/BalanceItem'
import { formattedAmount, sliceAddress, zeroAddress } from '@/utils'
import { useUserContext } from '@/context/UserContext'
import { useToken } from '@/hooks/useToken'
import {
    DefaultFullModalInputNumberEditorRender,
    FullModalField,
} from '@/components/common/FullModal/Field'


interface PaidMessagesProps {
    room: ChatRoom
    update: () => Promise<void>
}

export const PaidMessages: React.FC<PaidMessagesProps> = React.memo<PaidMessagesProps>(props => {
    const { room } = props
    const roomInfo = room.info()
    if (!room.baseData || !roomInfo) return null
    const { messagePayment } = roomInfo
    const { userState } = useUserContext()
    const [loading, setLoading] = useState(false)
    const [loadingWithdraw, setLoadingWithdraw] = useState(false)
    const [newPrice, setNewPrice] = useState<string | undefined>(undefined)
    useEffect(() => {
        setNewPrice(messagePayment.amount)
    }, [messagePayment])

    const disabled = useMemo(() => {
        if (!userState.profile) return true
        return !PermissionsManager.isAdmin({
            entity: room,
            profile: userState.profile,
        })
    }, [room, userState.profile])

    const token = useMemo(() => useToken(messagePayment.token), [messagePayment])

    const handleChangePrice = useCallback((value?: string) => {
        if (!value) return
        setNewPrice(new BigNumber(value).shiftedBy(token?.decimals || 0).toString())
    }, [token])

    const handleSave = useCallback(() => {
        if (!newPrice) return
        const newRoomInfo = cloneDeep(roomInfo)
        newRoomInfo.messagePayment.amount = newPrice
        setLoading(true)
        userState.profile?.editRoomInfo(newRoomInfo, room, () => {
            props.update().then(() => setLoading(false))
        }).catch(() => setLoading(false))
    }, [newPrice, props.update])

    const handleWithdraw = useCallback((..._pros: any) => {
        if (!userState.profile) return
        setLoadingWithdraw(true)
        userState.profile.withdrawNativeFrom(room.address, () => {
            props.update().then(() => {
                setLoadingWithdraw(false)
            })
        }).catch(() => setLoadingWithdraw(false))
    }, [room, userState.profile])

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap h-20 mobile:h-fit">
                <div className="w-3/6 mobile:w-full">
                    <FullModalField
                        title="Token"
                        value={`${token?.name}: (${sliceAddress(messagePayment.token.toString())})` || sliceAddress(messagePayment.token.toString())}
                    />
                </div>
                <div className="w-2/6 mobile:w-full pr-1">
                    <FullModalField
                        title="Price"
                        value={formattedAmount(newPrice || messagePayment.amount, token?.decimals)}
                        editable={!disabled && !loading}
                        renderEditor={DefaultFullModalInputNumberEditorRender}
                        onSave={handleChangePrice}
                    />
                </div>
                <div className="w-1/6 mobile:w-full flex my-auto mobile:justify-center justify-end">
                    <Button
                        type="primary"
                        loading={loading}
                        disabled={disabled || !newPrice || newPrice === messagePayment.amount}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <Divider />
            <div>
                <FullModalCommonTitle>Balances</FullModalCommonTitle>
                <BalanceItem
                    disabled={disabled || loadingWithdraw}
                    address={room.baseData.token.toString()}
                    balance={
                        room.baseData.token.equals(zeroAddress)
                            ? room.balance
                            : room.baseData.balance
                    }
                    onAction={handleWithdraw}
                    onlyWithdraw
                />
            </div>
        </div>
    )

})

PaidMessages.displayName = 'PaidMessages'
