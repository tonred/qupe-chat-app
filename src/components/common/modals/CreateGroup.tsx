import {
    Button, Divider, Input, Space, Typography,
} from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { type ChatServer } from 'qupe-lib/dist/chat/server'

import { useRootContext } from '@/context/RootContext'
import { Avatar } from '@/components/common/Avatar'
import { useWallet } from '@/stores/WalletService'
import { error } from '@/utils'
import { useUserContext } from '@/context/UserContext'

import { closeModal, ModalWrapper } from '../Modal'
import { Slides, type SlidesRef } from '../Slides'

export const ModalCreateGroup: React.FC = React.memo(() => {
    const slidesRef = useRef<SlidesRef>(null)
    const [serverId, setServerId] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const { root } = useRootContext()
    const { userState, update } = useUserContext()
    const wallet = useWallet()
    const navigate = useNavigate()
    const onServerCrated = useCallback((s?: ChatServer) => {
        setLoading(false)
        if (s) {
            update().then(() => {
                navigate(`/main/c/${s.id}/-1`, { replace: true })
                closeModal()
                setLoading(false)
            })
        }
    }, [])
    const handleCreate = useCallback(() => {
        if (!root || !wallet.account?.address || !userState.profile) return
        setLoading(true)
        root.deployServer(
            // @ts-ignore
            wallet.account.address,
            {
                description: '',
                title: name,
            },
            onServerCrated,
        ).catch(e => {
            error(e)
        })
    }, [name, root, wallet.account])
    const handleSelectCreateServer = useCallback(() => {
        slidesRef.current?.next()
    }, [])

    const handleBack = useCallback(() => {
        slidesRef.current?.prev()
    }, [])

    const handleGoToServer = useCallback(() => {
        setLoading(true)
        setHasError(false)
        try {
            const sid = Number(serverId)
            root?.getServer(sid).then(s => {
                if (s.isDeployed) {
                    navigate(`/main/c/${sid}/-1`, { replace: true })
                    closeModal()
                }
                else {
                    setHasError(true)
                }
            })
        }
        catch {
            setHasError(true)
        }

        setLoading(false)
    }, [serverId, root])

    return (
        <ModalWrapper style={{ maxWidth: 440 }}>
            <Slides ref={slidesRef}>
                <div>
                    <Typography.Title level={4} className="text-center mb-4">
                        Add server
                    </Typography.Title>

                    <Typography.Paragraph className="mb-4 text-center">
                        Create a new server or join an existing one
                    </Typography.Paragraph>

                    <div className="space-y-2.5">
                        <div
                            className="w-full border rounded py-2 px-3 cursor-pointer font-bold hover:bg-white hover:bg-opacity-10"
                            onClick={handleSelectCreateServer}
                        >
                            Create new server
                        </div>
                        <Divider />
                        <Space.Compact style={{ height: '40px', width: '100%' }}>
                            <Input
                                status={hasError ? 'error' : undefined}
                                className="w-full shadow-none border-1 font-bold placeholder:text-gray-400"
                                maxLength={9}
                                placeholder="Server ID or Domain"
                                type="text"
                                onChange={e => setServerId(e.target.value)}
                            />
                            <Button
                                loading={loading}
                                type="primary"
                                style={{ height: '40px' }}
                                onClick={handleGoToServer}
                            >
                                Go to Server
                            </Button>
                        </Space.Compact>
                    </div>
                </div>

                <div>
                    <Typography.Title level={4} className="text-center mb-4">
                        Customize your server
                    </Typography.Title>

                    <Typography.Paragraph className="text-center mb-2">
                        Don&apos;t worry, you can make changes anytime after this
                    </Typography.Paragraph>

                    <div className="text-center mb-2">
                        <Avatar className="mx-auto" size={80} name={name} />
                    </div>

                    <div>
                        <div>Server name:</div>

                        <Input
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
                        <Button
                            type="primary"
                            disabled={!userState.profile}
                            loading={loading}
                            onClick={handleCreate}
                        >
                            Create server
                        </Button>
                    </div>
                </div>
            </Slides>
        </ModalWrapper>
    )
})
ModalCreateGroup.displayName = 'ModalCreateGroup'
