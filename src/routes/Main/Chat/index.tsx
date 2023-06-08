import { useParams } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'

import Navbar from '@/components/common/Navbar'
import Sidebar from '@/components/common/Sidebar'
import Wrapper from '@/components/common/Wrapper'
import { ChatServerContextProvider } from '@/context/ChatServerContext'
import { ChatRoomContextProvider } from '@/context/ChatRoomContext'
import Chat from '@/components/common/Chat'
import Input from '@/components/common/Chat/Input'
import { useUserContext } from '@/context/UserContext'
import { JoinBtn } from '@/components/common/JoinBtn'
import { SidebarContextProvider } from '@/components/common/Sidebar/SidebarContext'
import { PageContent } from '@/components/common/Chat/PageContent'

const MainChat = React.memo(() => {
    const { serverId = '-1', roomId = '-1' } = useParams<{
        serverId: string
        roomId: string
    }>()
    const { userState, update } = useUserContext()
    const [isJoined, setIsJoined] = useState(false)
    const [joinServerLoading, setJoinServerLoading] = useState(false)
    const onJoined = useCallback(() => {
        update()
    }, [userState.profile])
    const handleJoin = useCallback(() => {
        if (!userState.profile) return
        setJoinServerLoading(true)
        userState.profile
            .joinServer(Number(serverId), onJoined)
            .catch(() => setJoinServerLoading(false))
    }, [userState.profile, serverId])

    useEffect(() => {
        setJoinServerLoading(false)
    }, [serverId])

    useEffect(() => {
        setIsJoined(userState.jointServers.has(Number(serverId)))
    }, [serverId, userState])

    return (
        <SidebarContextProvider>
            <ChatServerContextProvider serverId={Number(serverId)}>
                <ChatRoomContextProvider roomId={Number(roomId)}>
                    <Navbar />
                    <div className="flex flex-row flex-1 overflow-hidden relative">
                        <PageContent sidebar={<Sidebar />}>
                            <div className="flex flex-auto bg-content-light dark:bg-content-dark overflow-hidden">
                                <Wrapper>
                                    <Chat isJoined={isJoined}>
                                        {isJoined ? (
                                            <Input />
                                        ) : (
                                            <JoinBtn
                                                loading={joinServerLoading}
                                                callback={handleJoin}
                                            />
                                        )}
                                    </Chat>
                                </Wrapper>
                            </div>
                        </PageContent>
                    </div>
                </ChatRoomContextProvider>
            </ChatServerContextProvider>
        </SidebarContextProvider>
    )
})

MainChat.displayName = 'MainChat'

export default MainChat
