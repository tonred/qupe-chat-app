import { useCallback, useEffect, useState } from 'react'
import { type ChatRoom, type StoredMessage } from 'qupe-lib/dist/chat/room'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { type Subscription, type TransactionId } from 'everscale-inpage-provider'

import { debug } from '@/utils'
import { type ChatMessage } from '@/components/common/Chat/types'

type MType = Map<number, StoredMessage>

function parseMessages(messages: MType, pending: MType): ChatMessage[] {
    let tm: ChatMessage[] = []
    messages.forEach((value, key) => {
        tm.push({
            _id: key,
            author: value.profile,
            content: value.data.message.c,
            createdAt: value.createdAt,
            isHidden: value.isHidden,
            isPending: false,
            roomId: Number(value.data.roomID),
            serverId: Number(value.data.serverID),
        } as ChatMessage)
    })
    // eslint-disable-next-line no-nested-ternary
    tm = tm.sort((a, b) => (a._id > b._id ? 1 : b._id > a._id ? -1 : 0))
    pending.forEach((value, key) => {
        tm.push({
            _id: key,
            author: value.profile,
            content: value.data.message.c,
            createdAt: value.createdAt,
            isPending: true,
            roomId: Number(value.data.roomID),
            serverId: Number(value.data.serverID),
        } as ChatMessage)
    })
    return tm
}

interface ChatRoomProps {
    chatRoom?: ChatRoom
    messages: ChatMessage[]
    subscription?: Subscription<any>
    loading: boolean
    update: () => Promise<void>
    hasMoreMessages: boolean
    loadMoreMessages: (limit: number) => void
}

export const useRoom = (
    server: ChatServer,
    roomId: number,
    withMessages = false,
): ChatRoomProps => {
    const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>()
    const [subscription, setSubscription] = useState<Subscription<any> | undefined>(undefined)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const [lastTx, setLastTx] = useState<TransactionId | undefined>(undefined)
    const [trigger, setTrigger] = useState(0)
    const [loading, setLoading] = useState(true)
    const update = useCallback(async () => {
        if (!chatRoom) return
        debug('forceUpdate')
        await chatRoom.update()
        setTrigger(p => p + 1)
    }, [chatRoom])

    useEffect(() => {
        if (!chatRoom) return
        setMessages(parseMessages(chatRoom.storedMessages, chatRoom.pendingMessages))
    }, [trigger])

    const onMessage = useCallback(() => {
        setTrigger(p => p + 1)
    }, [])

    const loadMoreMessages = useCallback((limit: number) => {
        if (!chatRoom || !hasMoreMessages) return
        setLoading(true)
        chatRoom.getMessages(limit, lastTx).then(tx => {
            setHasMoreMessages(!!tx.continuation)
            setLastTx(tx.continuation)
            setMessages(parseMessages(chatRoom.storedMessages, chatRoom.pendingMessages))
            setLoading(false)
        })
    }, [chatRoom, lastTx, hasMoreMessages])
    useEffect(() => {
        if (!server) return
        setMessages([])
        setLoading(true)
        debug('New Chat Room', server.id, roomId)
        if (roomId < 0) {
            setChatRoom(undefined)
            setLoading(false)
            return
        }
        server.getRoomById(roomId).then(r => {
            setChatRoom(r)
            if (withMessages) {
                r.subscribe(onMessage).then(s => {
                    setSubscription(s)
                    r.getMessages(35).then(tx => {
                        setHasMoreMessages(!!tx.continuation)
                        setLastTx(tx.continuation)
                        setMessages(parseMessages(r.storedMessages, r.pendingMessages))
                        setLoading(false)
                    })
                })
            }
        })
    }, [server, roomId])

    return {
        chatRoom,
        hasMoreMessages,
        loading,
        loadMoreMessages,
        messages,
        subscription,
        update,
    }
}
