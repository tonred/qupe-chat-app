import {
    Button, Divider, Input, Space, Switch, Typography,
} from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { useNavigate } from 'react-router'

import { Avatar } from '@/components/common/Avatar'
import { useUserContext } from '@/context/UserContext'

import { closeModal, ModalWrapper } from '../Modal'
import { Slides, type SlidesRef } from '../Slides'

export const ModalCreateRoom: React.FC<{ chatServer: ChatServer; update: () => void }> = React.memo(
    props => {
        const slidesRef = useRef<SlidesRef>(null)
        const { chatServer, update } = props
        const { userState } = useUserContext()
        const [name, setName] = useState('')
        const [anyCanSend, setAnyCanSend] = useState(true)
        const [loading, setLoading] = useState(false)
        const navigate = useNavigate()

        const onRoomCrated = useCallback((room?: ChatRoom) => {
            setLoading(false)
            if (room) {
                navigate(`/main/c/${chatServer.id}/${room.baseData?.roomId}`, { replace: true })
                update()
                closeModal()
            }
        }, [])
        const handleCreate = useCallback(() => {
            if (!userState.profile || !chatServer) return
            setLoading(true)
            userState.profile
                .createRoom(chatServer, { title: name }, anyCanSend, onRoomCrated)
                .catch(() => setLoading(false))
        }, [name, anyCanSend, chatServer, userState.profile])

        const handleBack = useCallback(() => {
            closeModal()
        }, [])

        return (
            <ModalWrapper style={{ maxWidth: 440 }}>
                <Slides ref={slidesRef}>
                    <div>
                        <Typography.Title level={4} className="text-center mb-4">
                            Create new room
                        </Typography.Title>

                        <Typography.Paragraph className="text-center mb-2">
                            Don&apos;t worry, you can make changes anytime after this
                        </Typography.Paragraph>

                        <div className="text-center mb-2">
                            <Avatar className="mx-auto" size={80} name={name} />
                        </div>

                        <div>
                            <div>Room name:</div>

                            <Input
                                className="shadow-none"
                                size="large"
                                maxLength={100}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <Space className="py-3">
                            <div>Anyone can send a message:</div>
                            <Switch defaultChecked={anyCanSend} onChange={setAnyCanSend} />
                        </Space>

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
                                Create
                            </Button>
                        </div>
                    </div>
                </Slides>
            </ModalWrapper>
        )
    },
)
ModalCreateRoom.displayName = 'ModalCreateRoom'
