import {
    Button, Col, Divider, Input, InputNumber, Row, Switch, Typography,
} from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { useNavigate } from 'react-router'
import { type PaymentInfo } from 'qupe-lib/dist/types'
import { type Address } from 'everscale-inpage-provider'
import BigNumber from 'bignumber.js'

import { Avatar } from '@/components/common/Avatar'
import { useUserContext } from '@/context/UserContext'
import { TokenSelect } from '@/components/common/TokenSelect'
import { zeroAddress } from '@/utils'
import { useToken } from '@/hooks/useToken'

import { closeModal, ModalWrapper } from '../Modal'
import { Slides, type SlidesRef } from '../Slides'

export const ModalCreateRoom: React.FC<{ chatServer: ChatServer; update: () => void }> = React.memo(
    props => {
        const slidesRef = useRef<SlidesRef>(null)
        const { chatServer, update } = props
        const { userState } = useUserContext()
        const [name, setName] = useState('')
        const [anyCanSend, setAnyCanSend] = useState(true)
        const [paidMessages, setPaidMessages] = useState(false)
        const [price, setPrice] = useState('0')
        const [token, setToken] = useState<Address>(zeroAddress)

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
            let messagePayment
            if (paidMessages) {
                messagePayment = {
                    amount: new BigNumber(price).shiftedBy(useToken(token)?.decimals || 0).toString(),
                    token,
                } as PaymentInfo
            }
            userState.profile
                .createRoom(chatServer, { title: name }, anyCanSend, onRoomCrated, messagePayment)
                .catch(() => setLoading(false))
        }, [name, anyCanSend, chatServer, userState.profile, paidMessages, token, price])

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
                        <div className="mx-1 py-2 border-b border-white border-opacity-5">
                            <Row>
                                <Col flex={1}>Anyone can send a message</Col>

                                <Col>
                                    <Switch defaultChecked={anyCanSend} onChange={setAnyCanSend} />
                                </Col>
                            </Row>
                        </div>
                        <div className="mx-1 py-2 border-b border-white border-opacity-5">
                            <Row>
                                <Col flex={1}>Paid messages</Col>

                                <Col>
                                    <Switch defaultChecked={paidMessages} onChange={setPaidMessages} />
                                </Col>
                            </Row>
                            {paidMessages && (
                                <div className="py-2">
                                    <Row className="space-x-1">
                                        <Col flex={1}><TokenSelect withCustom={false} onSelect={setToken} /></Col>

                                        <Col>
                                            <InputNumber<string>
                                                placeholder="Price"
                                                style={{ width: 150 }}
                                                min="0"
                                                max="9999999"
                                                step="0.1"
                                                onChange={value => value && setPrice(value)}
                                                stringMode
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )}
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
