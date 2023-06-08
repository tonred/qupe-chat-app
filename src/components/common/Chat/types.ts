import { type ChatProfile } from 'qupe-lib/dist/chat/profile'

export interface ChatMessageReaction {
    name: string
    author: string
}

export interface ChatMessage {
    _id: number
    isPending: boolean
    content: string
    author: ChatProfile
    serverId: number
    roomId: number
    reactions?: ChatMessageReaction[]
    hasRecall?: boolean
    meta?: Record<string, unknown>
    createdAt?: number
    isHidden?: boolean
}
