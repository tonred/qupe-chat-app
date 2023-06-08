import React, { type PropsWithChildren, useContext } from 'react'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { type Subscription } from 'everscale-inpage-provider'
import { useParams } from 'react-router-dom'

import { useChatServerContext } from '@/context/ChatServerContext'
import { type ChatMessage } from '@/components/common/Chat/types'
import { useRoom } from '@/hooks/useRoom'

interface ChatRoomContextProps {
    chatRoom?: ChatRoom
    messages: ChatMessage[]
    subscription?: Subscription<any>
    loading: boolean
    hasMoreMessages: boolean
    loadMoreMessages: (limit: number) => void
}

const DEFAULT_VALUES = {
    chatRoom: undefined,
    hasMoreMessages: true,
    loading: true,
    loadMoreMessages: (_limit: number) => null,
    messages: [],
    subscription: undefined,
}
const ChatRoomContext = React.createContext<ChatRoomContextProps>(DEFAULT_VALUES)

ChatRoomContext.displayName = 'ChatRoomContext'

export const ChatRoomContextProvider: React.FC<PropsWithChildren<{ roomId: number }>> = React.memo(
    props => {
        const { chatServer } = useChatServerContext()
        const { serverId = '-1' } = useParams<{
            serverId: string
        }>()

        const value = useRoom(chatServer!, props.roomId, true)

        if (value.chatRoom?.baseData?.serverId === Number(serverId)) {
            return (
                <ChatRoomContext.Provider value={value}>{props.children}</ChatRoomContext.Provider>
            )
        }
        return (
            <ChatRoomContext.Provider value={DEFAULT_VALUES}>
                {props.children}
            </ChatRoomContext.Provider>
        )
    },
)
ChatRoomContextProvider.displayName = 'ChatRoomContextProvider'

export function useChatRoomContext(): ChatRoomContextProps {
    const context = useContext(ChatRoomContext)

    return context
}
