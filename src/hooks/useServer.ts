import { useCallback, useEffect, useState } from 'react'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { type ChatServer } from 'qupe-lib/dist/chat/server'

import { useRootContext } from '@/context/RootContext'
import { debug } from '@/utils'

export const useServer = (
    serverId: number,
): {
    chatServer?: ChatServer
    loading: boolean
    rooms: ChatRoom[]
    update: () => Promise<void>
} => {
    const { root } = useRootContext()
    const [chatServer, setChatServer] = useState<ChatServer>()
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [loading, setLoading] = useState(true)
    const update = useCallback(async () => {
        if (!chatServer) return
        debug('forceUpdate')
        await chatServer.update()
        setRooms(await chatServer.getRooms())
    }, [chatServer])
    useEffect(() => {
        debug('New Chat Server', serverId)
        setLoading(true)
        root!.getServer(serverId).then(s => {
            setChatServer(s!)
            s.getRooms().then(r => {
                setRooms(r)
                setLoading(false)
            })
        })
    }, [root, serverId])

    return {
        chatServer,
        loading,
        rooms,
        update,
    }
}
