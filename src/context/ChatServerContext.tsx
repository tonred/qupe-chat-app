import React, { type PropsWithChildren, useContext } from 'react'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'

import { useServer } from '@/hooks/useServer'

interface ChatServerContextProps {
    chatServer?: ChatServer
    rooms: ChatRoom[]
    update: () => Promise<void>
    loading: boolean
}

const ChatServerContext = React.createContext<ChatServerContextProps>({
    chatServer: undefined,
    loading: true,
    rooms: [],
    update: () => Promise.resolve(undefined),
})

ChatServerContext.displayName = 'ChatServerContext'

export const ChatServerContextProvider: React.FC<PropsWithChildren<{ serverId: number }>> = React.memo(props => {
    const value = useServer(props.serverId)

    return (
        <ChatServerContext.Provider value={value}>{props.children}</ChatServerContext.Provider>
    )
})
ChatServerContextProvider.displayName = 'ChatServerContextProvider'

export function useChatServerContext(): ChatServerContextProps {
    const context = useContext(ChatServerContext)

    return context
}
