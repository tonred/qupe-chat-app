import {
    Button, Divider, Input, Typography,
} from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { type ChatProfile } from 'qupe-lib/dist/chat/profile'

import { Avatar } from '@/components/common/Avatar'
import { useRootContext } from '@/context/RootContext'
import { useWallet } from '@/stores/WalletService'
import { useUserContext } from '@/context/UserContext'
import { error } from '@/utils'

import { closeModal, ModalWrapper } from '../Modal'
import { Slides, type SlidesRef } from '../Slides'

export const ModalCreateProfile: React.FC = React.memo(() => {
    const slidesRef = useRef<SlidesRef>(null)
    const { root } = useRootContext()
    const { update } = useUserContext()
    const wallet = useWallet()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    const onProfileDeployed = useCallback((profile?: ChatProfile) => {
        setLoading(false)
        if (profile) {
            // navigate(`/main/c/${chatServer.id}/${room.baseData?.roomId}`, { replace: true })
            update()
            closeModal()
        }
    }, [])
    const handleCreate = useCallback(() => {
        if (!root || !wallet.account) return
        setHasError(false)
        setLoading(true)
        root.deployProfile(
            // @ts-ignore
            wallet.account.address,
            [`0x${wallet.account.publicKey}`],
            {
                // avatar: 'QmfE56iG2YKPrm73u5xaTAuSSEVDNSTdvgJkmUL22STi7E',
                displayName: name,
            },
            onProfileDeployed,
        ).catch(e => {
            error(e)
            setHasError(true)
            setLoading(false)
        })
        // userState.profile.createRoom(chatServer, { title: name }, onRoomCrated)
    }, [root, wallet, name])

    const handleBack = useCallback(() => {
        closeModal()
        // slidesRef.current?.prev()
    }, [])

    return (
        <ModalWrapper style={{ maxWidth: 440 }}>
            <Slides ref={slidesRef}>
                <div>
                    <Typography.Title level={4} className="text-center mb-4">
                        Deploy profile
                    </Typography.Title>

                    <Typography.Paragraph className="text-center mb-2">
                        Don&apos;t worry, you can make changes anytime after this
                    </Typography.Paragraph>

                    <div className="text-center mb-2">
                        <Avatar className="mx-auto" size={80} name={name} />
                    </div>

                    <div>
                        <div>Display name:</div>

                        <Input
                            status={hasError ? 'error' : undefined}
                            className="shadow-none"
                            size="large"
                            maxLength={100}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <Divider />

                    <div className="flex justify-between">
                        <Button
                            type="link"
                            onClick={handleBack}
                            className="text-gray-600 dark:text-white font-bold"
                        >
                            Back
                        </Button>
                        <Button type="primary" loading={loading} onClick={handleCreate}>
                            Deploy
                        </Button>
                    </div>
                </div>
            </Slides>
        </ModalWrapper>
    )
})
ModalCreateProfile.displayName = 'ModalCreateProfile'
