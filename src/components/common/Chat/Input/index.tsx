import React, {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react'
import _uniq from 'lodash/uniq'
import { LoadingOutlined } from '@ant-design/icons'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'
import { type PaymentInfo } from 'qupe-lib/dist/types'
import BigNumber from 'bignumber.js'

import { isEnterHotkey } from '@/utils/hot-key'
import { useRpc } from '@/hooks'
import { useWallet } from '@/stores/WalletService'
import { useRootContext } from '@/context/RootContext'
import { useUserContext } from '@/context/UserContext'
import { useChatRoomContext } from '@/context/ChatRoomContext'
import { debug, formattedAmount } from '@/utils'
import { useToken } from '@/hooks/useToken'

import './index.less'

import { ChatInputBoxInput } from './input'

const Input = React.memo(() => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [mentions, setMentions] = useState<string[]>([])
    const rpc = useRpc()
    const wallet = useWallet()
    const { root } = useRootContext()
    const { userState } = useUserContext()
    const { chatRoom } = useChatRoomContext()
    const [errorMessage, setErrorMessage] = useState('')
    const messagePayment = useMemo((): PaymentInfo | undefined => {
        const _messagePayment = chatRoom?.info()?.messagePayment
        if (!_messagePayment || _messagePayment.amount === '0') return undefined
        return _messagePayment
    }, [chatRoom])
    const messagePriceEl = useMemo(() => {
        if (!messagePayment) return null
        const token = useToken(messagePayment.token)
        return (
            <div className="select-none opacity-75">
                {formattedAmount(messagePayment.amount, token?.decimals)}
                {' '}
                {token?.name}
            </div>
        )
    }, [chatRoom])
    const canSendMessage = useMemo(() => {
        if (!chatRoom || !userState.profile) return false
        if (!PermissionsManager.canSendMessage({ entity: chatRoom, profile: userState.profile })) {
            setErrorMessage('You don\'t have permission to send message in this room')
            return false
        }
        if (messagePayment) {
            const balance = userState.profile.balances.get(messagePayment.token.toString())
            if (!balance || new BigNumber(balance).lt(messagePayment.amount)) {
                setErrorMessage('You don\'t have enough tokens on your balance')
                return false
            }
        }
        return true
    }, [chatRoom, userState.profile])

    const handleSendMsg = useCallback(() => {
        (async () => {
            if (!wallet.account || !root || !userState.profile || !chatRoom) return
            setLoading(true)
            try {
                await userState.profile.sendMessage(
                    // @ts-ignore
                    rpc,
                    chatRoom,
                    message,
                    wallet.account!.publicKey,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    messagePayment,
                )
                setMessage('')
            }
            catch (e) {}
            setLoading(false)
        })().then(() => {
            debug('Message sent')
        })
        debug(message, {
            mentions: _uniq(mentions),
        })
    }, [message, mentions])
    useEffect(() => {
        if (!loading) inputRef.current?.focus()
    }, [loading])
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (isEnterHotkey(e.nativeEvent)) {
                e.preventDefault()
                handleSendMsg()
            }
        },
        [handleSendMsg],
    )
    const onPaste = useCallback((e: any) => {
        debug(e)
    }, [])

    // const handlePaste = useCallback(
    //     (e: React.ClipboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    //         const helper = new ClipboardHelper(e)
    //         const image = helper.hasImage()
    //         if (image) {
    //             e.preventDefault()
    //             uploadMessageImage(image).then(({ url, width, height }) => {
    //                 props.onSendMsg(
    //                     getMessageTextDecorators().image(url, { width, height }),
    //                 )
    //             })
    //         }
    //     },
    //     [props.onSendMsg],
    // )
    return (
        <div className="px-4 py-2">
            <div className="bg-white dark:bg-gray-600 flex rounded-md items-center">
                <div className="flex-1 w-0">
                    <ChatInputBoxInput
                        placeholder={
                            !canSendMessage
                                ? errorMessage
                                : undefined
                        }
                        autoFocus
                        inputRef={inputRef}
                        value={message}
                        onPaste={onPaste}
                        onChange={(message_, mentions_) => {
                            setMessage(message_)
                            setMentions(mentions_)
                        }}
                        disabled={!canSendMessage || loading || !chatRoom?.isDeployed}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="px-2 flex space-x-1">
                    {loading && <LoadingOutlined className="text-xl" />}
                    {messagePriceEl}
                    {/* todo */}
                    {/* <div>actions</div> */}
                    {/* {pluginChatInputButtons.map((item, i) => */}
                    {/*  React.cloneElement(item.render(), { */}
                    {/*    key: `plugin-chatinput-btn#${i}`, */}
                    {/*  }) */}
                    {/* )} */}

                    {/* <ChatInputEmotion /> */}

                    {/* {message ? ( */}
                    {/*  <Icon */}
                    {/*    icon="mdi:send-circle-outline" */}
                    {/*    className="text-2xl cursor-pointer" */}
                    {/*    onClick={() => handleSendMsg()} */}
                    {/*  /> */}
                    {/* ) : ( */}
                    {/*  <ChatInputAddon /> */}
                    {/* )} */}
                </div>
            </div>
        </div>
    )
})

Input.displayName = 'Input'

export default Input
